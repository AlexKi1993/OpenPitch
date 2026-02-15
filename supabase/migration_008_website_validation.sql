-- Migration 008: Website URL validation
-- Ensures website field only accepts valid http/https URLs

ALTER TABLE profiles
  ADD CONSTRAINT profiles_website_protocol
  CHECK (website IS NULL OR website ~ '^https?://');
