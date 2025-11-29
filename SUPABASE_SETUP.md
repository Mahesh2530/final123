# Supabase Integration Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - Project Name: `edulibrary`
   - Database Password: (create a strong password)
   - Region: Choose closest to your location
5. Click "Create new project" and wait for setup to complete

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` key under "Project API keys")

## Step 3: Configure Environment Variables

1. In your project root, create a `.env` file
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire content from `supabase-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL and create all tables

## Step 5: Update Your Code to Use Supabase

Update the import statements in your components to use the new Supabase functions:

**Before (IndexedDB):**
```javascript
import { addResource, getResources, ... } from "../utils/indexeddb"
```

**After (Supabase):**
```javascript
import { addResource, getResources, ... } from "../utils/supabasedb"
```

Files to update:
- `src/components/AdminDashboard.jsx`
- `src/components/StudentDashboard.jsx`
- `src/components/LoginPage.jsx`
- `src/components/CreateAccountPage.jsx`

## Step 6: Verify Installation

Run your project:
```bash
npm run dev
```

## Important Notes

### File Storage
For PDF files larger than 1GB, you should use Supabase Storage instead of storing in the database:

1. Go to **Storage** in Supabase dashboard
2. Create a bucket named `resources`
3. Set it to public or authenticated access as needed
4. Update the upload code to use Supabase Storage API

### Security
- Never commit your `.env` file to GitHub
- The `.env` file is already in `.gitignore`
- Use environment variables in Netlify for deployment

### Row Level Security (RLS)
The schema includes basic RLS policies. You can customize them in:
**Authentication** → **Policies** in Supabase dashboard

## Deployment on Netlify

1. Go to your Netlify site settings
2. Navigate to **Site settings** → **Environment variables**
3. Add your Supabase variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Trigger a new deployment

## Benefits of Supabase

✅ Real-time data synchronization
✅ Automatic backups
✅ Better performance for large datasets
✅ Built-in authentication (optional to use)
✅ File storage for large PDFs
✅ PostgreSQL database (more robust than IndexedDB)
✅ Works across devices and browsers

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
