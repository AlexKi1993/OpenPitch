-- Migration 003: Fix collaborator RLS name typo + remove email exposure

-- ============================================
-- 1. Fix collaborators policy (wrong name in migration_002)
-- ============================================

-- Drop the ACTUAL original policy (correct name from schema.sql)
DROP POLICY IF EXISTS "Collaborators are viewable by everyone" ON collaborators;

-- Also drop in case migration_002 created with wrong name
DROP POLICY IF EXISTS "Collaborations are viewable by everyone" ON collaborators;
DROP POLICY IF EXISTS "Collaborations viewable by participants" ON collaborators;

-- Create correct restricted policy
CREATE POLICY "Collaborators viewable by participants"
  ON collaborators FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() IN (
      SELECT author_id FROM ideas WHERE id = collaborators.idea_id
    )
  );

-- ============================================
-- 2. Remove email from profiles table (redundant with Supabase Auth)
-- The app only uses email from supabase.auth.getUser(), never from profiles.
-- ============================================

ALTER TABLE profiles DROP COLUMN IF EXISTS email;

-- Update handle_new_user trigger to not reference email column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;
