# Supabase Setup Guide - Complete

## Issues You May Encounter

### 1. Bucket not found
The application is trying to upload images to a Supabase storage bucket named `issue-images` which doesn't exist yet.

### 2. Location column not found
The application tries to store location data in a `location` column which may be missing from your database.

## Complete Setup Instructions

Follow these steps in order to set up your Supabase project completely.

---

## Step 1: Run Main Database Setup

Go to **SQL Editor** in Supabase Dashboard and run the entire `supabase-setup.sql` file.

This creates:
- ✅ `issues` table with all required columns (including `location`)
- ✅ `comments` table
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Proper permissions

---

## Step 2: Add Location Column (If Missing)

If you already created the `issues` table before, you need to add the `location` column:

**Option A: Using SQL Editor**
```sql
-- Add location column
ALTER TABLE issues
ADD COLUMN IF NOT EXISTS location JSONB;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_issues_location ON issues USING GIN (location);
```

**Option B: Run Migration File**

Run the entire `add-location-column.sql` file in SQL Editor.

**Verify it worked:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'issues' 
  AND column_name = 'location';
```

Should return: `location | jsonb`

---

## Step 3: Create Storage Bucket

## Step 3: Create Storage Bucket

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Project Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click "Create a new bucket"

3. **Create the Bucket**
   - **Name**: `issue-images`
   - **Public bucket**: ✅ Check this (so images can be accessed via public URLs)
   - **File size limit**: 10 MB (recommended)
   - **Allowed MIME types**: `image/*` (allows all image formats)
   - Click "Create bucket"

4. **Set Bucket Policies (Important!)**
   
   After creating the bucket, click on it and go to "Policies" tab:
   
   **Policy 1: Allow authenticated users to upload**
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'issue-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

   **Policy 2: Allow public read access**
   ```sql
   CREATE POLICY "Allow public read access"
   ON storage.objects
   FOR SELECT
   TO public
   USING (bucket_id = 'issue-images');
   ```

   **Policy 3: Allow users to update their own images**
   ```sql
   CREATE POLICY "Allow users to update own images"
   ON storage.objects
   FOR UPDATE
   TO authenticated
   USING (
     bucket_id = 'issue-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   )
   WITH CHECK (
     bucket_id = 'issue-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

   **Policy 4: Allow users to delete their own images**
   ```sql
   CREATE POLICY "Allow users to delete own images"
   ON storage.objects
   FOR DELETE
   TO authenticated
   USING (
     bucket_id = 'issue-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

### Option 2: Using SQL Editor (Fastest)

Go to SQL Editor in Supabase Dashboard and run:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-images', 'issue-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'issue-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to images
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'issue-images');

-- Allow users to update their own images
CREATE POLICY "Allow users to update own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'issue-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'issue-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Allow users to delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'issue-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Option 3: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Create migration file
supabase migration new create_issue_images_bucket

# Add the SQL above to the migration file, then apply
supabase db push
```

---

## Step 4: Verification

After creating the bucket, verify it works:

1. **Test Upload in Dashboard**:
   - Go to Storage → issue-images
   - Click "Upload file"
   - Upload a test image
   - Verify you can see it

2. **Test in Application**:
   - Go to http://localhost:3001/report
   - Try reporting an issue with an image
   - Check if the upload succeeds

---

## Database Schema Reference

### Issues Table Structure

```sql
CREATE TABLE issues (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  image_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location JSONB  -- Format: { "address": "Street, City, State, Country" }
);
```

### Location Field Format

The `location` column stores JSON data in this format:
```json
{
  "address": "123 Main Street, Mumbai, Maharashtra, India"
}
```

---

## Storage Structure

The application organizes images by user:

```
issue-images/
├── {user-id-1}/
│   ├── {timestamp}_image1.jpg
│   ├── {timestamp}_image2.png
│   └── ...
├── {user-id-2}/
│   ├── {timestamp}_image1.jpg
│   └── ...
└── ...
```

This ensures:
- Users can only manage their own images
- Easy to track who uploaded what
- Organized file structure

---

## Security Notes

✅ **What's Secure**:
- Only authenticated users can upload
- Users can only upload to their own folder
- Public can read (necessary for displaying images)
- Users can only modify/delete their own images

⚠️ **What to Monitor**:
- Storage usage (10MB limit per file)
- Total bucket size
- Implement image optimization if needed

---

## Troubleshooting

### Error: "Bucket not found"
- Make sure bucket name is exactly `issue-images`
- Check bucket is created in the correct project
- Verify bucket policies are applied

### Error: "Column 'location' does not exist" or "Could not find the 'location' column"
- Run the `add-location-column.sql` migration
- Or manually add the column: `ALTER TABLE issues ADD COLUMN IF NOT EXISTS location JSONB;`
- Verify with: `SELECT column_name FROM information_schema.columns WHERE table_name = 'issues';`

### Error: "Permission denied"
- Verify storage policies are created
- Check user is authenticated
- Ensure user_id matches folder name

### Images not loading
- Verify bucket is set to `public`
- Check CORS settings if needed
- Verify publicUrl is correct

---

## Additional Configuration (Optional)

### Image Optimization

Add these settings in Supabase Dashboard → Storage → issue-images → Settings:

```json
{
  "maxFileSize": 10485760,
  "allowedMimeTypes": [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ],
  "imageTransformation": {
    "enabled": true,
    "formats": ["webp"],
    "quality": 80
  }
}
```

### File Size Limits

Modify in Storage settings:
- Default: 50 MB
- Recommended for images: 10 MB
- Maximum: Based on your Supabase plan

---

## Complete Setup Checklist

### Database Setup
- [ ] Run `supabase-setup.sql` in SQL Editor
- [ ] Verify `issues` table exists: `SELECT * FROM issues LIMIT 1;`
- [ ] Verify `location` column exists (run query from Step 2)
- [ ] Verify `comments` table exists: `SELECT * FROM comments LIMIT 1;`
- [ ] Check RLS policies are active: Go to Database → Tables → issues → Policies

### Storage Setup
- [ ] Create `issue-images` bucket
- [ ] Set bucket to public
- [ ] Add INSERT policy for authenticated users
- [ ] Add SELECT policy for public access
- [ ] Add UPDATE policy for owners
- [ ] Add DELETE policy for owners
- [ ] Test upload in dashboard (Storage → issue-images → Upload file)

### Application Testing
- [ ] Verify environment variables in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```
- [ ] Start development server: `npm run dev`
- [ ] Navigate to http://localhost:3001
- [ ] Sign up / Log in
- [ ] Test report form (http://localhost:3001/report)
- [ ] Test location capture (click "Get Current Location")
- [ ] Test image upload (select an image file)
- [ ] Submit the form
- [ ] Check dashboard (http://localhost:3001/dashboard) for new issue
- [ ] Verify image displays correctly
- [ ] Verify location displays correctly

---

## Quick Setup Checklist (Original)

- [ ] Create `issue-images` bucket
- [ ] Set bucket to public
- [ ] Add INSERT policy for authenticated users
- [ ] Add SELECT policy for public access
- [ ] Add UPDATE policy for owners
- [ ] Add DELETE policy for owners
- [ ] Test upload in dashboard
- [ ] Test upload in application
- [ ] Verify images display correctly

## Support

If you continue to have issues:
1. Check Supabase logs in Dashboard → Logs
2. Check browser console for detailed errors
3. Verify environment variables in `.env.local`
4. Ensure Supabase project is active and accessible

---

**After completing these steps, the image upload functionality in the Report page should work perfectly!**
