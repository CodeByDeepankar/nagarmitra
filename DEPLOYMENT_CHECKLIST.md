# ✅ Deployment Checklist

Use this checklist to get your Citizen App running!

## 🔧 Setup (One-time)

### 1. Supabase Setup
- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project
- [ ] Copy Project URL
- [ ] Copy Anon Key
- [ ] Run `supabase-setup.sql` in SQL Editor
- [ ] Create storage bucket named `issue-images`
- [ ] Make storage bucket public
- [ ] Add storage policies (see `supabase-setup.sql`)

### 2. Environment Variables
- [ ] Navigate to `apps/citizen/`
- [ ] Create `.env.local` file
- [ ] Add:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-url-here
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
  ```
- [ ] Save file

### 3. Install & Run
- [ ] Open terminal in project root
- [ ] Run `npm install` (if not already done)
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3001

## ✨ Testing Checklist

### Authentication
- [ ] Visit http://localhost:3001
- [ ] Click "Sign Up" or go to `/auth/signup`
- [ ] Create account with email/password
- [ ] Verify redirect to sign in
- [ ] Sign in with credentials
- [ ] Verify redirect to dashboard

### Report Issue
- [ ] After signing in, click "Report an Issue"
- [ ] Fill in:
  - [ ] Title
  - [ ] Description  
  - [ ] Category (select from dropdown)
  - [ ] Upload a photo (optional)
  - [ ] Add coordinates (optional)
- [ ] Click "Submit Report"
- [ ] Verify redirect to dashboard
- [ ] Verify issue appears in list

### Dashboard
- [ ] Verify your issue is listed
- [ ] Check status badge (should be "Pending")
- [ ] Verify image thumbnail appears
- [ ] Verify category tag shows
- [ ] Verify timestamp is correct
- [ ] Click on the issue card

### Issue Details
- [ ] Verify you're on `/issues/[id]`
- [ ] Check all issue details display:
  - [ ] Title
  - [ ] Status badge
  - [ ] Image
  - [ ] Description
  - [ ] Category
  - [ ] Date
  - [ ] Location (if added)
- [ ] Scroll to comments section
- [ ] Add a test comment
- [ ] Verify comment appears
- [ ] Verify timestamp on comment

### Navigation
- [ ] Click "Nagar Mitra" logo → goes to home
- [ ] Click "Home" link → goes to home
- [ ] Click "Report" link → goes to report page
- [ ] Click "Dashboard" link → goes to dashboard
- [ ] From issue detail, click "Back to Dashboard" → goes to dashboard

## 🐛 Troubleshooting

### App won't start?
- [ ] Check you ran `npm install`
- [ ] Check you're in the correct directory (project root)
- [ ] Check port 3001 is not in use
- [ ] Try `npm run dev -- --port 3002` for different port

### Can't sign up/in?
- [ ] Check `.env.local` exists in `apps/citizen/`
- [ ] Verify Supabase URL and key are correct
- [ ] Check Supabase project is active
- [ ] Verify internet connection

### Issues not showing?
- [ ] Check you're signed in
- [ ] Verify database tables were created (check Supabase dashboard)
- [ ] Check RLS policies are enabled
- [ ] Try signing out and back in

### Image upload fails?
- [ ] Verify storage bucket `issue-images` exists
- [ ] Check bucket is public
- [ ] Verify storage policies are set correctly
- [ ] Check file size (keep under 5MB)

### TypeScript errors?
- [ ] These are normal during development
- [ ] Run `npm install` again
- [ ] Restart VS Code
- [ ] The app should still work

### Tailwind styles not working?
- [ ] Check `tailwind.config.ts` exists
- [ ] Verify `postcss.config.js` exists
- [ ] Check `globals.css` has `@tailwind` directives
- [ ] Try clearing Next.js cache: `rm -rf .next`

## 📋 Demo Preparation

### Before Your Demo
- [ ] Create a test account
- [ ] Add 3-5 sample issues with photos
- [ ] Add comments to some issues
- [ ] Have different status types (Pending, In Progress, Resolved)
- [ ] Test on mobile device or responsive mode
- [ ] Prepare talking points about features

### Features to Showcase
1. **User Flow**
   - Sign up/Sign in
   - Report issue with photo
   - View dashboard
   - See issue details
   - Add comment

2. **Technical Highlights**
   - Next.js 15 App Router
   - TypeScript
   - Supabase integration
   - Real-time data
   - Responsive design
   - Clean UI/UX

3. **Future Enhancements**
   - Mapbox integration
   - Push notifications
   - Analytics
   - Admin dashboard (separate app)

## 🚀 Production Deployment (Optional)

### Vercel Deployment
- [ ] Push code to GitHub
- [ ] Connect to Vercel
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy
- [ ] Test production URL

### Environment Variables for Production
```
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
```

## ✅ Final Check

Before demo:
- [ ] App runs without errors
- [ ] All features work
- [ ] Mobile responsive
- [ ] Sample data loaded
- [ ] Demo script ready
- [ ] Backup plan (screenshots/video)

## 🎯 You're Ready!

Once all checkboxes are ticked, your Citizen App is ready for the hackathon!

**Good luck! 🚀**
