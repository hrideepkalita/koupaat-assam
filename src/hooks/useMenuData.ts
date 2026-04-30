import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DbCategory = {
  id: string;
  name: string;
  sort_order: number;
};

export type DbMenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  image_url: string | null;
  available: boolean;
  sort_order: number;
};

export const useMenuData = () => {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [items, setItems] = useState<DbMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    const [{ data: cats }, { data: its }] = await Promise.all([
      supabase.from("menu_categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").order("sort_order"),
    ]);
    setCategories(cats ?? []);
    setItems((its ?? []).map((i) => ({ ...i, price: Number(i.price) })));
    setLoading(false);
  };

  useEffect(() => {
    refetch();
    const ch = supabase
      .channel("menu-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, refetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_categories" }, refetch)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  return { categories, items, loading, refetch };
};

export const useSettings = () => {
  const [whatsapp, setWhatsapp] = useState("918822821202");
  const [template, setTemplate] = useState("Hello Koupaat, I want to order:");

  useEffect(() => {
    supabase
      .from("app_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setWhatsapp(data.whatsapp_number);
          setTemplate(data.message_template);
        }
      });
  }, []);

  return { whatsapp, template };
};
