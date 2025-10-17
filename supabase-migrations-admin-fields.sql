-- =====================================================
-- Add Admin Management Fields to Issues Table
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Add missing columns for admin management
ALTER TABLE issues 
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  ADD COLUMN IF NOT EXISTS complaint_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS sanctioned_amount NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS used_amount NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS amount_breakdown TEXT,
  ADD COLUMN IF NOT EXISTS estimated_start_date DATE,
  ADD COLUMN IF NOT EXISTS estimated_completion_date DATE,
  ADD COLUMN IF NOT EXISTS actual_completion_date DATE,
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS progress_notes TEXT;

-- Update the status check constraint to include 'Rejected'
ALTER TABLE issues 
  DROP CONSTRAINT IF EXISTS issues_status_check;

ALTER TABLE issues 
  ADD CONSTRAINT issues_status_check 
  CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Rejected'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_issues_priority ON issues(priority);
CREATE INDEX IF NOT EXISTS idx_issues_department ON issues(department);
CREATE INDEX IF NOT EXISTS idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX IF NOT EXISTS idx_issues_estimated_completion_date ON issues(estimated_completion_date);

-- Update RLS policies to allow admins to view and update all issues
-- First, create a function to check if a user is an admin (you'll need to set this up based on your admin logic)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, return true for testing
  -- In production, you should check against an admin role or admin table
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own issues" ON issues;
DROP POLICY IF EXISTS "Admins can view all issues" ON issues;
DROP POLICY IF EXISTS "Admins can update all issues" ON issues;

-- Recreate policies
-- Users can view their own issues
CREATE POLICY "Users can view their own issues"
  ON issues FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- Admins can view all issues
CREATE POLICY "Admins can view all issues"
  ON issues FOR SELECT
  USING (is_admin());

-- Admins can update all issues
CREATE POLICY "Admins can update all issues"
  ON issues FOR UPDATE
  USING (is_admin());

-- Comment for reference
COMMENT ON TABLE issues IS 'Citizen issue reports with admin management fields';
