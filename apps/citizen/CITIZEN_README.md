# Nagar Mitra - Citizen App

A Next.js 15 application for reporting and tracking civic issues in your neighborhood.

## Features

- **Home Page** - Welcome screen with features overview and user stats
- **Report Issue** - Submit civic issues with photos, location, and categories
- **Dashboard** - View all your reported issues with status tracking
- **Issue Details** - View detailed information and add comments
- **Authentication** - Sign up and sign in functionality using Supabase Auth

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Supabase (Auth + Database + Storage)
- Shared UI components from `@repo/ui`
- Turborepo monorepo architecture

## Prerequisites

- Node.js >= 18
- npm >= 10
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

From the root of the monorepo:

```bash
npm install
```

### 2. Configure Supabase

#### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

#### Set up Database Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create issues table
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
  image_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for issues
CREATE POLICY "Users can view their own issues"
  ON issues FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create issues"
  ON issues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issues"
  ON issues FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for comments
CREATE POLICY "Users can view comments on their issues"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM issues
      WHERE issues.id = comments.issue_id
      AND issues.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### Set up Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `issue-images`
3. Make it public
4. Set the following policy:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'issue-images' AND
    auth.role() = 'authenticated'
  );

-- Allow public read access
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'issue-images');
```

### 3. Environment Variables

Create a `.env.local` file in `apps/citizen/`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the Development Server

From the root:

```bash
npm run dev
```

The citizen app will be available at: http://localhost:3001

## Project Structure

```
apps/citizen/
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout with navigation
│   ├── globals.css              # Global styles with Tailwind
│   ├── report/
│   │   └── page.tsx             # Report issue form
│   ├── dashboard/
│   │   └── page.tsx             # User's issues dashboard
│   ├── issues/[id]/
│   │   ├── page.tsx             # Issue detail page
│   │   └── CommentsSection.tsx  # Comments component
│   └── auth/
│       ├── signin/page.tsx      # Sign in page
│       └── signup/page.tsx      # Sign up page
├── middleware.ts                # Auth middleware
├── tailwind.config.ts           # Tailwind configuration
└── package.json                 # Dependencies

packages/lib/
├── supabaseClient.ts            # Supabase client setup
├── auth.ts                      # Auth helpers
└── types.ts                     # TypeScript types

packages/ui/src/
├── button.tsx                   # Button component
├── card.tsx                     # Card component
├── badge.tsx                    # Badge component
└── input.tsx                    # Form input components
```

## Usage

### Sign Up / Sign In

1. Navigate to `/auth/signup` to create an account
2. Sign in at `/auth/signin`

### Report an Issue

1. Click "Report an Issue" from the home page or navigate to `/report`
2. Fill in the form:
   - Title (required)
   - Description (required)
   - Category (required)
   - Photo (optional)
   - Location coordinates (optional)
3. Submit the report

### View Your Issues

1. Navigate to `/dashboard` or click "My Issues"
2. See all your reported issues with status badges
3. Click on any issue to view details

### Add Comments

1. Open any issue detail page
2. Scroll to the comments section
3. Add your comment and submit

## Status Badges

- **Pending** (Yellow) - Issue reported, awaiting review
- **In Progress** (Blue) - Issue is being addressed
- **Resolved** (Green) - Issue has been fixed

## Future Enhancements

- Mapbox integration for interactive maps
- Real-time notifications
- Image compression before upload
- Offline support with service workers
- Admin panel for issue management (in separate admin app)
- Analytics and reporting

## License

MIT
