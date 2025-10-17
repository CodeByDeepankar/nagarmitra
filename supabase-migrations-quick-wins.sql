-- Quick Wins Database Schema Updates
-- Run this in Supabase SQL Editor

-- Add new columns to issues table for advanced features
ALTER TABLE issues
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS complaint_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS sanctioned_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS used_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS amount_breakdown JSONB,
ADD COLUMN IF NOT EXISTS estimated_start_date DATE,
ADD COLUMN IF NOT EXISTS estimated_completion_date DATE,
ADD COLUMN IF NOT EXISTS actual_completion_date DATE,
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS progress_notes TEXT;

-- Create index for duplicate detection (faster searches)
CREATE INDEX IF NOT EXISTS idx_issues_title_location ON issues USING gin(to_tsvector('english', title || ' ' || COALESCE(location->>'address', '')));

-- Create index for complaint count and priority
CREATE INDEX IF NOT EXISTS idx_issues_priority_count ON issues(priority, complaint_count);

-- Update existing issues to have priority based on complaint_count
UPDATE issues 
SET priority = CASE 
    WHEN complaint_count >= 10 THEN 'high'
    WHEN complaint_count >= 5 THEN 'medium'
    ELSE 'low'
END
WHERE priority = 'low';

-- Add comment for documentation
COMMENT ON COLUMN issues.priority IS 'Priority level based on complaint count: low (<5), medium (5-9), high (10+)';
COMMENT ON COLUMN issues.complaint_count IS 'Number of duplicate complaints for this issue';
COMMENT ON COLUMN issues.sanctioned_amount IS 'Budget approved for resolving this issue';
COMMENT ON COLUMN issues.used_amount IS 'Actual amount spent on resolution';
COMMENT ON COLUMN issues.amount_breakdown IS 'JSON breakdown of expenses: {materials: 0, labor: 0, equipment: 0, other: 0}';
COMMENT ON COLUMN issues.estimated_start_date IS 'Planned start date for work';
COMMENT ON COLUMN issues.estimated_completion_date IS 'Expected completion date';
COMMENT ON COLUMN issues.actual_completion_date IS 'Actual date when issue was resolved';
COMMENT ON COLUMN issues.assigned_to IS 'Authority user ID assigned to handle this issue';
COMMENT ON COLUMN issues.department IS 'Department responsible for resolution';
COMMENT ON COLUMN issues.rejection_reason IS 'Reason if issue is rejected';
COMMENT ON COLUMN issues.progress_notes IS 'Latest update notes from authority';

-- Create progress_updates table for tracking lifecycle
CREATE TABLE IF NOT EXISTS progress_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    updated_by UUID NOT NULL REFERENCES auth.users(id),
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    notes TEXT,
    photo_urls TEXT[],
    amount_used DECIMAL(10,2),
    update_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for progress updates
CREATE INDEX IF NOT EXISTS idx_progress_issue ON progress_updates(issue_id, update_date DESC);

-- Add RLS policies for progress_updates
ALTER TABLE progress_updates ENABLE ROW LEVEL SECURITY;

-- Anyone can view progress updates
CREATE POLICY "Anyone can view progress updates"
ON progress_updates FOR SELECT
USING (true);

-- Only authenticated users can insert progress updates
CREATE POLICY "Authenticated users can insert progress updates"
ON progress_updates FOR INSERT
WITH CHECK (auth.uid() = updated_by);

-- Users can update their own progress updates
CREATE POLICY "Users can update own progress updates"
ON progress_updates FOR UPDATE
USING (auth.uid() = updated_by);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON progress_updates TO authenticated;
GRANT SELECT ON progress_updates TO anon;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Quick Wins schema updates completed successfully!';
    RAISE NOTICE 'New columns added: priority, complaint_count, financial fields, dates';
    RAISE NOTICE 'New table created: progress_updates';
    RAISE NOTICE 'Indexes created for performance optimization';
END $$;
