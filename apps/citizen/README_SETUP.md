# 🎯 Nagar Mitra - Setup & Troubleshooting

This document helps you fix common errors and set up your Supabase backend correctly.

---

## 📋 Common Errors & Quick Fixes

### ❌ Error: "Could not find the 'location' column"

**Quick Fix (2 minutes):**
1. Go to Supabase Dashboard → SQL Editor
2. Run this:
   ```sql
   ALTER TABLE issues ADD COLUMN IF NOT EXISTS location JSONB;
   CREATE INDEX IF NOT EXISTS idx_issues_location ON issues USING GIN (location);
   ```
3. Done! ✅

**See:** `QUICK_FIX.md` for detailed instructions

---

### ❌ Error: "Bucket not found" (issue-images)

**Quick Fix (3 minutes):**
1. Go to Supabase Dashboard → Storage
2. Click "Create a new bucket"
3. Name: `issue-images`
4. Check "Public bucket" ✅
5. Click "Create"
6. Go to Policies tab and add the 4 security policies

**See:** `STORAGE_SETUP.md` → Step 3 for detailed instructions

---

### ❌ Error: "Permission denied" or RLS errors

**Quick Fix (5 minutes):**
1. Go to Supabase Dashboard → SQL Editor
2. Run the entire `supabase-setup.sql` file
3. This creates all tables, policies, and permissions

---

## 🚀 Complete First-Time Setup

If you're setting up from scratch, follow these steps in order:

### 1️⃣ Database Setup (5 minutes)

**Run in SQL Editor:**
```sql
-- Copy entire content from supabase-setup.sql and run it
```

This creates:
- ✅ `issues` table (with location column)
- ✅ `comments` table
- ✅ Row Level Security policies
- ✅ Indexes for performance

**Verify:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('issues', 'comments');
```

---

### 2️⃣ Storage Setup (3 minutes)

**In Supabase Dashboard:**
1. **Storage** → **Create new bucket**
2. Name: `issue-images`, Public: ✅
3. **Policies** → Add 4 policies (see STORAGE_SETUP.md)

**Verify:**
- Upload a test image in Storage → issue-images
- Check if you can see it

---

### 3️⃣ Environment Variables (1 minute)

**Create `.env.local` in `/apps/citizen/`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get these from:** Supabase Dashboard → Settings → API

---

### 4️⃣ Test the App (2 minutes)

```bash
cd apps/citizen
npm run dev
```

Visit http://localhost:3001 and test:
- ✅ Sign up / Log in
- ✅ Report an issue with image
- ✅ View dashboard
- ✅ See issue details

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `QUICK_FIX.md` | 2-minute fix for location column error |
| `STORAGE_SETUP.md` | Complete setup guide (database + storage) |
| `supabase-setup.sql` | Main database schema & policies |
| `add-location-column.sql` | Migration to add location column |
| `README_SETUP.md` | This file - overview & troubleshooting |

---

## 🔍 Debugging Tips

### Check Database Connection
```sql
SELECT current_database();
```

### List All Tables
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Check Issues Table Structure
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'issues'
ORDER BY ordinal_position;
```

### Check Storage Buckets
Go to: Storage → Should see `issue-images` bucket

### Check RLS Policies
Go to: Database → Tables → issues → Policies
Should see 4 policies (SELECT, INSERT, UPDATE, DELETE)

---

## ✅ Complete Setup Checklist

### Database
- [ ] `issues` table exists
- [ ] `comments` table exists
- [ ] `location` column exists in issues (type: JSONB)
- [ ] RLS is enabled on both tables
- [ ] 4 policies exist for issues
- [ ] 4 policies exist for comments

### Storage
- [ ] `issue-images` bucket exists
- [ ] Bucket is public
- [ ] 4 storage policies applied

### Application
- [ ] `.env.local` has correct credentials
- [ ] App runs without errors: `npm run dev`
- [ ] Can sign up / log in
- [ ] Can report issue with image
- [ ] Image uploads successfully
- [ ] Location captures successfully
- [ ] Issues appear in dashboard

---

## 🆘 Still Need Help?

### Common Issues:

**"No such table: issues"**
→ Run `supabase-setup.sql`

**"Column location does not exist"**
→ Run `add-location-column.sql` or see `QUICK_FIX.md`

**"Bucket not found: issue-images"**
→ Create storage bucket (see `STORAGE_SETUP.md` Step 3)

**"Permission denied"**
→ Check RLS policies are created

**"Invalid API key"**
→ Check `.env.local` credentials

**Images don't load**
→ Make sure bucket is public

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

## 🎉 Success!

Once everything is set up, you should be able to:
- ✅ Report civic issues with photos
- ✅ Track GPS location automatically
- ✅ View all your reports in dashboard
- ✅ See detailed issue information
- ✅ Add comments to issues

**Enjoy using Nagar Mitra!** 🏙️
