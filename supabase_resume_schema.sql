-- ==============================================
-- Resume Feature Database Schema
-- Run this SQL in your Supabase SQL Editor
-- ==============================================

-- Resume profiles table (main profile info)
CREATE TABLE resume_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  job_title TEXT,
  location TEXT,
  primary_link TEXT,
  profile_image_url TEXT,
  about TEXT,
  -- Section visibility toggles
  show_work_experience BOOLEAN DEFAULT true,
  show_education BOOLEAN DEFAULT true,
  show_projects BOOLEAN DEFAULT true,
  show_contact BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work experience entries
CREATE TABLE resume_work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resume_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_link TEXT,
  location TEXT,
  start_year INTEGER NOT NULL,
  end_year INTEGER, -- NULL means "Now"
  achievements TEXT[], -- Optional notable achievements
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education entries
CREATE TABLE resume_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resume_profiles(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT,
  field TEXT,
  start_year INTEGER,
  end_year INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project entries
CREATE TABLE resume_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resume_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  year INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact info
CREATE TABLE resume_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resume_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  website TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- Enable Row Level Security
-- ==============================================

ALTER TABLE resume_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_contact ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- Public Read Access Policies
-- ==============================================

CREATE POLICY "Public read access" ON resume_profiles 
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON resume_work_experience 
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON resume_education 
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON resume_projects 
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON resume_contact 
  FOR SELECT USING (true);

-- ==============================================
-- Owner Write Access Policies
-- ==============================================

CREATE POLICY "Owner can insert" ON resume_profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update" ON resume_profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete" ON resume_profiles 
  FOR DELETE USING (auth.uid() = user_id);

-- Work Experience
CREATE POLICY "Owner can insert work experience" ON resume_work_experience 
  FOR INSERT WITH CHECK (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can update work experience" ON resume_work_experience 
  FOR UPDATE USING (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can delete work experience" ON resume_work_experience 
  FOR DELETE USING (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

-- Education
CREATE POLICY "Owner can insert education" ON resume_education 
  FOR INSERT WITH CHECK (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can update education" ON resume_education 
  FOR UPDATE USING (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can delete education" ON resume_education 
  FOR DELETE USING (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

-- Projects
CREATE POLICY "Owner can insert projects" ON resume_projects 
  FOR INSERT WITH CHECK (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can update projects" ON resume_projects 
  FOR UPDATE USING (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can delete projects" ON resume_projects 
  FOR DELETE USING (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

-- Contact
CREATE POLICY "Owner can insert contact" ON resume_contact 
  FOR INSERT WITH CHECK (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can update contact" ON resume_contact 
  FOR UPDATE USING (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can delete contact" ON resume_contact 
  FOR DELETE USING (
    resume_id IN (SELECT id FROM resume_profiles WHERE user_id = auth.uid())
  );

-- ==============================================
-- Indexes for better query performance
-- ==============================================

CREATE INDEX idx_resume_profiles_user_id ON resume_profiles(user_id);
CREATE INDEX idx_resume_work_experience_resume_id ON resume_work_experience(resume_id);
CREATE INDEX idx_resume_education_resume_id ON resume_education(resume_id);
CREATE INDEX idx_resume_projects_resume_id ON resume_projects(resume_id);
CREATE INDEX idx_resume_contact_resume_id ON resume_contact(resume_id);

-- ==============================================
-- Updated_at trigger function
-- ==============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resume_profiles_updated_at
  BEFORE UPDATE ON resume_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
