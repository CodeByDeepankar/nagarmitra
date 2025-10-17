-- Add audio_url column to issues table
ALTER TABLE issues 
ADD COLUMN audio_url TEXT;

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-audio', 'issue-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for issue-audio bucket
CREATE POLICY "Public Access for issue-audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-audio');

CREATE POLICY "Authenticated users can upload audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'issue-audio');

CREATE POLICY "Users can update own audio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'issue-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own audio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'issue-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create an index on audio_url for better query performance
CREATE INDEX idx_issues_audio_url ON issues(audio_url) WHERE audio_url IS NOT NULL;
