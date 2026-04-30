
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Restrict bucket listing (individual file access via direct URL still works)
DROP POLICY IF EXISTS "Menu images are publicly accessible" ON storage.objects;
CREATE POLICY "Menu images viewable via direct URL"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');
