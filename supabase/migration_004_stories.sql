-- Migration 004: Storyboard — Erfahrungsberichte (Erfolg / FuckUp)
-- Diesen Code im Supabase SQL Editor ausführen

-- ============================================
-- STORIES
-- ============================================
CREATE TABLE public.stories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  story_type text NOT NULL DEFAULT 'success' CHECK (story_type IN ('success', 'fuckup')),
  idea_summary text NOT NULL DEFAULT '',
  what_went_well text NOT NULL DEFAULT '',
  what_went_wrong text NOT NULL DEFAULT '',
  lessons_learned text NOT NULL DEFAULT '',
  advice text NOT NULL DEFAULT '',
  vote_count int NOT NULL DEFAULT 0,
  comment_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Length constraints
ALTER TABLE public.stories
  ADD CONSTRAINT stories_title_length CHECK (char_length(title) <= 200),
  ADD CONSTRAINT stories_idea_summary_length CHECK (char_length(idea_summary) <= 500),
  ADD CONSTRAINT stories_what_went_well_length CHECK (char_length(what_went_well) <= 5000),
  ADD CONSTRAINT stories_what_went_wrong_length CHECK (char_length(what_went_wrong) <= 5000),
  ADD CONSTRAINT stories_lessons_learned_length CHECK (char_length(lessons_learned) <= 5000),
  ADD CONSTRAINT stories_advice_length CHECK (char_length(advice) <= 3000);

-- Indexes
CREATE INDEX stories_created_at_idx ON public.stories (created_at DESC);
CREATE INDEX stories_vote_count_idx ON public.stories (vote_count DESC);
CREATE INDEX stories_story_type_idx ON public.stories (story_type);
CREATE INDEX stories_title_search_idx ON public.stories USING gin (to_tsvector('german', title || ' ' || idea_summary));

-- RLS
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stories are viewable by everyone" ON public.stories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create stories" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own stories" ON public.stories
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own stories" ON public.stories
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================
-- STORY_VOTES
-- ============================================
CREATE TABLE public.story_votes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  story_id uuid REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(story_id, user_id)
);

ALTER TABLE public.story_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story votes are viewable by everyone" ON public.story_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote on stories" ON public.story_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own story votes" ON public.story_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update story vote_count
CREATE OR REPLACE FUNCTION public.update_story_vote_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.stories SET vote_count = vote_count + 1 WHERE id = new.story_id;
    RETURN new;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.stories SET vote_count = vote_count - 1 WHERE id = old.story_id;
    RETURN old;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_story_vote_change
  AFTER INSERT OR DELETE ON public.story_votes
  FOR EACH ROW EXECUTE PROCEDURE public.update_story_vote_count();

-- ============================================
-- STORY_COMMENTS
-- ============================================
CREATE TABLE public.story_comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  story_id uuid REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Length constraint
ALTER TABLE public.story_comments
  ADD CONSTRAINT story_comments_content_length CHECK (char_length(content) <= 5000);

ALTER TABLE public.story_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story comments are viewable by everyone" ON public.story_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment on stories" ON public.story_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own story comments" ON public.story_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own story comments" ON public.story_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Trigger to update story comment_count
CREATE OR REPLACE FUNCTION public.update_story_comment_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.stories SET comment_count = comment_count + 1 WHERE id = new.story_id;
    RETURN new;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.stories SET comment_count = comment_count - 1 WHERE id = old.story_id;
    RETURN old;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_story_comment_change
  AFTER INSERT OR DELETE ON public.story_comments
  FOR EACH ROW EXECUTE PROCEDURE public.update_story_comment_count();
