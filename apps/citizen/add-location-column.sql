-- =====================================================
-- Add location column to issues table
-- Run this if you already have the issues table created
-- =====================================================

-- Add the location column as JSONB to store address information
ALTER TABLE issues
ADD COLUMN IF NOT EXISTS location JSONB;

-- Create an index on the location column for faster queries
CREATE INDEX IF NOT EXISTS idx_issues_location ON issues USING GIN (location);

-- Optional: Update existing records to populate location from lat/long
-- This uses reverse geocoding API, so you'll need to do this from application
-- or manually update records

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'issues' 
  AND column_name = 'location';

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- The issues table now has a location column (JSONB type)
-- Format: { "address": "Street name, City, State, Country" }
-- Example: { "address": "123 Main St, Mumbai, Maharashtra, India" }
