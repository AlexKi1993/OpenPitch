-- Migration 006: Lessons — Gründer-Learnings teilen
-- Diesen Code im Supabase SQL Editor ausführen

-- ============================================
-- LESSONS
-- ============================================
CREATE TABLE public.lessons (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Sonstiges' CHECK (category IN ('Marketing', 'Team & Kultur', 'Finanzen', 'Produkt', 'Fundraising', 'Technik', 'Vertrieb', 'Sonstiges')),
  situation text NOT NULL DEFAULT '',
  learning text NOT NULL DEFAULT '',
  advice text NOT NULL DEFAULT '',
  vote_count int NOT NULL DEFAULT 0,
  comment_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Length constraints
ALTER TABLE public.lessons
  ADD CONSTRAINT lessons_title_length CHECK (char_length(title) <= 200),
  ADD CONSTRAINT lessons_situation_length CHECK (char_length(situation) <= 5000),
  ADD CONSTRAINT lessons_learning_length CHECK (char_length(learning) <= 5000),
  ADD CONSTRAINT lessons_advice_length CHECK (char_length(advice) <= 3000);

-- Indexes
CREATE INDEX lessons_created_at_idx ON public.lessons (created_at DESC);
CREATE INDEX lessons_vote_count_idx ON public.lessons (vote_count DESC);
CREATE INDEX lessons_category_idx ON public.lessons (category);
CREATE INDEX lessons_title_search_idx ON public.lessons USING gin (to_tsvector('german', title || ' ' || situation));

-- RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone" ON public.lessons
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create lessons" ON public.lessons
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own lessons" ON public.lessons
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own lessons" ON public.lessons
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================
-- LESSON_VOTES
-- ============================================
CREATE TABLE public.lesson_votes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(lesson_id, user_id)
);

ALTER TABLE public.lesson_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lesson votes are viewable by everyone" ON public.lesson_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote on lessons" ON public.lesson_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own lesson votes" ON public.lesson_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update lesson vote_count
CREATE OR REPLACE FUNCTION public.update_lesson_vote_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.lessons SET vote_count = vote_count + 1 WHERE id = new.lesson_id;
    RETURN new;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.lessons SET vote_count = vote_count - 1 WHERE id = old.lesson_id;
    RETURN old;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_lesson_vote_change
  AFTER INSERT OR DELETE ON public.lesson_votes
  FOR EACH ROW EXECUTE PROCEDURE public.update_lesson_vote_count();

-- ============================================
-- LESSON_COMMENTS
-- ============================================
CREATE TABLE public.lesson_comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Length constraint
ALTER TABLE public.lesson_comments
  ADD CONSTRAINT lesson_comments_content_length CHECK (char_length(content) <= 5000);

ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lesson comments are viewable by everyone" ON public.lesson_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment on lessons" ON public.lesson_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own lesson comments" ON public.lesson_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own lesson comments" ON public.lesson_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Trigger to update lesson comment_count
CREATE OR REPLACE FUNCTION public.update_lesson_comment_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.lessons SET comment_count = comment_count + 1 WHERE id = new.lesson_id;
    RETURN new;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.lessons SET comment_count = comment_count - 1 WHERE id = old.lesson_id;
    RETURN old;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_lesson_comment_change
  AFTER INSERT OR DELETE ON public.lesson_comments
  FOR EACH ROW EXECUTE PROCEDURE public.update_lesson_comment_count();
