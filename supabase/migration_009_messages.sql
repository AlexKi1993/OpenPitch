-- Migration 009: Messages table for inbox/conversation system
-- Run this in the Supabase SQL Editor

CREATE TABLE public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  collaborator_id uuid REFERENCES public.collaborators(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Constraints
ALTER TABLE public.messages
  ADD CONSTRAINT messages_content_length CHECK (char_length(content) <= 5000);

-- Indexes
CREATE INDEX messages_collaborator_id_idx ON public.messages (collaborator_id, created_at);
CREATE INDEX messages_sender_id_idx ON public.messages (sender_id);
CREATE INDEX messages_unread_idx ON public.messages (sender_id, is_read) WHERE is_read = false;

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Only applicant + idea author can view messages
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collaborators c
      JOIN public.ideas i ON i.id = c.idea_id
      WHERE c.id = collaborator_id
        AND (c.user_id = auth.uid() OR i.author_id = auth.uid())
    )
  );

-- Only participants can send messages
CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.collaborators c
      JOIN public.ideas i ON i.id = c.idea_id
      WHERE c.id = collaborator_id
        AND (c.user_id = auth.uid() OR i.author_id = auth.uid())
    )
  );

-- Allow participants to mark messages as read
CREATE POLICY "Participants can update read status" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.collaborators c
      JOIN public.ideas i ON i.id = c.idea_id
      WHERE c.id = collaborator_id
        AND (c.user_id = auth.uid() OR i.author_id = auth.uid())
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.collaborators c
      JOIN public.ideas i ON i.id = c.idea_id
      WHERE c.id = collaborator_id
        AND (c.user_id = auth.uid() OR i.author_id = auth.uid())
    )
  );
