-- =====================================================
-- Nagar Mitra - Citizen App Database Setup
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
  image_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location JSONB
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_issues_user_id ON issues(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_issue_id ON comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICIES FOR ISSUES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own issues" ON issues;
DROP POLICY IF EXISTS "Users can create issues" ON issues;
DROP POLICY IF EXISTS "Users can update their own issues" ON issues;
DROP POLICY IF EXISTS "Users can delete their own issues" ON issues;

-- Users can view their own issues
CREATE POLICY "Users can view their own issues"
  ON issues FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own issues
CREATE POLICY "Users can create issues"
  ON issues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own issues
CREATE POLICY "Users can update their own issues"
  ON issues FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own issues
CREATE POLICY "Users can delete their own issues"
  ON issues FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. CREATE RLS POLICIES FOR COMMENTS
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view comments on their issues" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- Users can view comments on their own issues
CREATE POLICY "Users can view comments on their issues"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM issues
      WHERE issues.id = comments.issue_id
      AND issues.user_id = auth.uid()
    )
  );

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON issues TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON comments TO authenticated;

-- =====================================================
-- 7. STORAGE BUCKET SETUP (Run separately in Storage)
-- =====================================================

-- NOTE: Storage bucket policies must be created in the Supabase Storage UI
-- or using the Storage API. Create a bucket named 'issue-images' and
-- apply the following policies:

/*
1. Create bucket: 'issue-images' (make it public)

2. Apply these policies in Storage > Policies:

-- Allow authenticated users to upload
INSERT POLICY: "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'issue-images' AND
    auth.role() = 'authenticated'
  );

-- Allow public read access
SELECT POLICY: "Public can view images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'issue-images');

-- Allow users to delete their own images
DELETE POLICY: "Users can delete their own images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'issue-images' AND
    auth.uid() = owner
  );
*/

-- =====================================================
-- 8. OPTIONAL: SEED DATA FOR TESTING
-- =====================================================

-- Uncomment below to insert sample data (replace user_id with actual user ID)

/*
INSERT INTO issues (user_id, title, description, category, status, latitude, longitude) VALUES
  ('your-user-id-here', 'Pothole on Main Street', 'Large pothole causing traffic issues', 'pothole', 'Pending', 19.0760, 72.8777),
  ('your-user-id-here', 'Street light not working', 'Street light near park has been out for a week', 'streetlight', 'In Progress', 19.0761, 72.8778),
  ('your-user-id-here', 'Garbage not collected', 'Garbage has not been collected for 3 days', 'garbage', 'Resolved', 19.0762, 72.8779);
*/

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Create storage bucket 'issue-images' in Supabase Storage UI
-- 2. Configure the storage policies as noted above
-- 3. Add your Supabase credentials to .env.local
-- 4. Run the app and test!
