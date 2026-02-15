-- Migration 007: Moderation — Ban-System & RLS-Updates für Mira
-- Mira Auth-User anlegen mit E-Mail: info@openpitch.eu
-- Diesen Code im Supabase SQL Editor ausführen

-- ============================================
-- 1. Ban-Felder zu profiles hinzufügen
-- ============================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_banned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ban_reason text;

-- Partial Index für schnelle Abfragen gebannter User
CREATE INDEX IF NOT EXISTS profiles_is_banned_idx ON public.profiles (id) WHERE is_banned = true;

-- ============================================
-- 2. RLS-Policies aktualisieren: Gebannte User ausblenden
-- ============================================

-- --- IDEAS ---
DROP POLICY IF EXISTS "Ideas are viewable by everyone" ON public.ideas;
CREATE POLICY "Ideas are viewable by everyone" ON public.ideas
  FOR SELECT USING (
    NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = ideas.author_id AND profiles.is_banned = true
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create ideas" ON public.ideas;
CREATE POLICY "Authenticated users can create ideas" ON public.ideas
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );

-- --- STORIES ---
DROP POLICY IF EXISTS "Stories are viewable by everyone" ON public.stories;
CREATE POLICY "Stories are viewable by everyone" ON public.stories
  FOR SELECT USING (
    NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = stories.author_id AND profiles.is_banned = true
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create stories" ON public.stories;
CREATE POLICY "Authenticated users can create stories" ON public.stories
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );

-- --- LESSONS ---
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;
CREATE POLICY "Lessons are viewable by everyone" ON public.lessons
  FOR SELECT USING (
    NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = lessons.author_id AND profiles.is_banned = true
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create lessons" ON public.lessons;
CREATE POLICY "Authenticated users can create lessons" ON public.lessons
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );

-- --- COMMENTS (Ideas) ---
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (
    NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = comments.author_id AND profiles.is_banned = true
    )
  );

DROP POLICY IF EXISTS "Authenticated users can comment" ON public.comments;
CREATE POLICY "Authenticated users can comment" ON public.comments
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );

-- --- STORY_COMMENTS ---
DROP POLICY IF EXISTS "Story comments are viewable by everyone" ON public.story_comments;
CREATE POLICY "Story comments are viewable by everyone" ON public.story_comments
  FOR SELECT USING (
    NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = story_comments.author_id AND profiles.is_banned = true
    )
  );

DROP POLICY IF EXISTS "Authenticated users can comment on stories" ON public.story_comments;
CREATE POLICY "Authenticated users can comment on stories" ON public.story_comments
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );

-- --- LESSON_COMMENTS ---
DROP POLICY IF EXISTS "Lesson comments are viewable by everyone" ON public.lesson_comments;
CREATE POLICY "Lesson comments are viewable by everyone" ON public.lesson_comments
  FOR SELECT USING (
    NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = lesson_comments.author_id AND profiles.is_banned = true
    )
  );

DROP POLICY IF EXISTS "Authenticated users can comment on lessons" ON public.lesson_comments;
CREATE POLICY "Authenticated users can comment on lessons" ON public.lesson_comments
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );

-- --- VOTES (Ideas) ---
DROP POLICY IF EXISTS "Authenticated users can vote" ON public.votes;
CREATE POLICY "Authenticated users can vote" ON public.votes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );

-- --- STORY_VOTES ---
DROP POLICY IF EXISTS "Authenticated users can vote on stories" ON public.story_votes;
CREATE POLICY "Authenticated users can vote on stories" ON public.story_votes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );

-- --- LESSON_VOTES ---
DROP POLICY IF EXISTS "Authenticated users can vote on lessons" ON public.lesson_votes;
CREATE POLICY "Authenticated users can vote on lessons" ON public.lesson_votes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );

-- --- COLLABORATORS ---
DROP POLICY IF EXISTS "Authenticated users can apply" ON public.collaborators;
CREATE POLICY "Authenticated users can apply" ON public.collaborators
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_banned = true
    )
  );
