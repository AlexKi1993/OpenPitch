-- Migration 005: Idea Images
-- Adds image upload support for ideas (max 3 images, max 2MB each)

-- 1. Create idea_images table
CREATE TABLE idea_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_idea_images_idea_id ON idea_images(idea_id);

-- 2. RLS for idea_images
ALTER TABLE idea_images ENABLE ROW LEVEL SECURITY;

-- Everyone can read images
CREATE POLICY "idea_images_select" ON idea_images
  FOR SELECT USING (true);

-- Only the idea author can insert images
CREATE POLICY "idea_images_insert" ON idea_images
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT author_id FROM ideas WHERE id = idea_id)
  );

-- Only the idea author can delete images
CREATE POLICY "idea_images_delete" ON idea_images
  FOR DELETE USING (
    auth.uid() = (SELECT author_id FROM ideas WHERE id = idea_id)
  );

-- 3. Create storage bucket for idea images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'idea-images',
  'idea-images',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- 4. Storage policies

-- Anyone can view idea images (public bucket)
CREATE POLICY "idea_images_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'idea-images');

-- Authenticated users can upload to their own folder
CREATE POLICY "idea_images_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'idea-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own uploads
CREATE POLICY "idea_images_storage_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'idea-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
