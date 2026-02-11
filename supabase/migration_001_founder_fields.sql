-- Migration: Neue Felder für Gründer-Intention
-- Diesen Code im Supabase SQL Editor ausführen

ALTER TABLE public.ideas
  ADD COLUMN self_implement boolean NOT NULL DEFAULT false,
  ADD COLUMN looking_for text DEFAULT '',
  ADD COLUMN mvp_budget text DEFAULT '',
  ADD COLUMN not_self_reason text DEFAULT '';
