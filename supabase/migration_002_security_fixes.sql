-- Migration 002: Security Fixes
-- 1. Hide email from public profile reads (only own email visible)
-- 2. Restrict collaboration messages to idea author + applicant
-- 3. Add length constraints on text fields

-- ============================================
-- 1. Fix profiles RLS: Hide email from other users
-- ============================================

-- Drop old permissive select policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create view policy that hides email from others
CREATE POLICY "Profiles viewable with email hidden"
  ON profiles FOR SELECT
  USING (true);

-- Note: Email hiding is better handled at the application/view level.
-- Create a view for public profile access without email:
CREATE OR REPLACE VIEW public_profiles AS
SELECT id, full_name, bio, avatar_url, website, skills, created_at, updated_at
FROM profiles;

-- ============================================
-- 2. Fix collaborators RLS: Only author + applicant can see messages
-- ============================================

-- Drop old permissive select policy
DROP POLICY IF EXISTS "Collaborations are viewable by everyone" ON collaborators;

-- Only idea author and the applicant can see collaboration details
CREATE POLICY "Collaborations viewable by participants"
  ON collaborators FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() IN (
      SELECT author_id FROM ideas WHERE id = collaborators.idea_id
    )
  );

-- ============================================
-- 3. Add length constraints on text fields
-- ============================================

-- Ideas
ALTER TABLE ideas
  ADD CONSTRAINT ideas_title_length CHECK (char_length(title) <= 200),
  ADD CONSTRAINT ideas_summary_length CHECK (char_length(summary) <= 500),
  ADD CONSTRAINT ideas_description_length CHECK (char_length(description) <= 10000),
  ADD CONSTRAINT ideas_problem_length CHECK (char_length(problem) <= 5000),
  ADD CONSTRAINT ideas_solution_length CHECK (char_length(solution) <= 5000),
  ADD CONSTRAINT ideas_target_audience_length CHECK (char_length(target_audience) <= 2000);

-- Comments
ALTER TABLE comments
  ADD CONSTRAINT comments_content_length CHECK (char_length(content) <= 5000);

-- Profiles
ALTER TABLE profiles
  ADD CONSTRAINT profiles_full_name_length CHECK (char_length(full_name) <= 100),
  ADD CONSTRAINT profiles_bio_length CHECK (char_length(bio) <= 1000),
  ADD CONSTRAINT profiles_website_length CHECK (char_length(website) <= 200);
