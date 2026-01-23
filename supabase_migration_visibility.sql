ALTER TABLE resumes ADD COLUMN visible_sections jsonb DEFAULT '{}'::jsonb;
