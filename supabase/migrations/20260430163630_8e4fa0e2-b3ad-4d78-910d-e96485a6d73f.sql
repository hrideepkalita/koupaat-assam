
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- First signup becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- ============ TIMESTAMP HELPER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============ CATEGORIES ============
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
ON public.menu_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
ON public.menu_categories FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_menu_categories_updated_at
BEFORE UPDATE ON public.menu_categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ MENU ITEMS ============
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu items are viewable by everyone"
ON public.menu_items FOR SELECT USING (true);

CREATE POLICY "Admins can manage menu items"
ON public.menu_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_menu_items_category ON public.menu_items(category_id);

-- ============ APP SETTINGS ============
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT NOT NULL DEFAULT '918822821202',
  message_template TEXT NOT NULL DEFAULT 'Hello Koupaat, I want to order:',
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone"
ON public.app_settings FOR SELECT USING (true);

CREATE POLICY "Admins can update settings"
ON public.app_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.app_settings (whatsapp_number, message_template) VALUES
  ('918822821202', 'Hello Koupaat, I want to order:');

-- ============ STORAGE ============
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true);

CREATE POLICY "Menu images are publicly accessible"
ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');

CREATE POLICY "Admins can upload menu images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update menu images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete menu images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));

-- ============ SEED DATA ============
INSERT INTO public.menu_categories (name, sort_order) VALUES
  ('Thali', 1), ('Breads', 2), ('Snacks', 3), ('Beverages', 4);

INSERT INTO public.menu_items (name, price, category_id, sort_order) VALUES
  ('Veg Thali', 180, (SELECT id FROM public.menu_categories WHERE name='Thali'), 1),
  ('Chicken Thali', 240, (SELECT id FROM public.menu_categories WHERE name='Thali'), 2),
  ('Mutton Thali', 320, (SELECT id FROM public.menu_categories WHERE name='Thali'), 3),
  ('Egg Thali', 200, (SELECT id FROM public.menu_categories WHERE name='Thali'), 4),
  ('Fish Thali', 260, (SELECT id FROM public.menu_categories WHERE name='Thali'), 5),
  ('Roti', 20, (SELECT id FROM public.menu_categories WHERE name='Breads'), 1),
  ('Paratha', 35, (SELECT id FROM public.menu_categories WHERE name='Breads'), 2),
  ('Puri', 25, (SELECT id FROM public.menu_categories WHERE name='Breads'), 3),
  ('Noodles', 120, (SELECT id FROM public.menu_categories WHERE name='Snacks'), 1),
  ('Roll', 90, (SELECT id FROM public.menu_categories WHERE name='Snacks'), 2),
  ('Fried Rice', 140, (SELECT id FROM public.menu_categories WHERE name='Snacks'), 3),
  ('Momo', 100, (SELECT id FROM public.menu_categories WHERE name='Snacks'), 4),
  ('Coffee', 50, (SELECT id FROM public.menu_categories WHERE name='Beverages'), 1),
  ('Tea', 30, (SELECT id FROM public.menu_categories WHERE name='Beverages'), 2);
