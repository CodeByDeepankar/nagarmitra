# 🚨 Quick Fix for "Location Column Not Found" Error

## The Problem
Error: `Could not find the 'location' column of 'issues' in the schema cache`

This happens when the database doesn't have the `location` column yet.

---

## 🔧 Quick Solution (2 Minutes)

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run This SQL
Copy and paste this into SQL Editor and click **Run**:

```sql
-- Add the missing location column
ALTER TABLE issues
ADD COLUMN IF NOT EXISTS location JSONB;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_issues_location ON issues USING GIN (location);
```

### Step 3: Verify It Worked
Run this query to confirm:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'issues' 
  AND column_name = 'location';
```

✅ You should see: `location | jsonb`

---

## ✨ That's It!

Now try submitting the report form again. The error should be gone! 🎉

---

## What This Column Does

The `location` column stores the human-readable address as JSON:

```json
{
  "address": "123 Main Street, Mumbai, Maharashtra, India"
}
```

This is captured when you click "Get Current Location" in the report form, which:
1. Gets your GPS coordinates (latitude/longitude)
2. Converts them to a readable address using reverse geocoding
3. Stores both in the database

---

## Still Having Issues?

### If you get "Bucket not found" error:
See: `STORAGE_SETUP.md` - You need to create the `issue-images` storage bucket

### If you get permission errors:
Make sure Row Level Security (RLS) policies are set up by running the full `supabase-setup.sql`

### If nothing works:
1. Check your `.env.local` has correct Supabase credentials
2. Make sure you're logged in to the app
3. Check browser console for detailed error messages

---

## Need Complete Setup?

See `STORAGE_SETUP.md` for:
- ✅ Complete database setup
- ✅ Storage bucket creation
- ✅ Security policies
- ✅ Full troubleshooting guide
