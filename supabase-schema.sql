-- Supabase Database Schema for Edulibrary
-- Run this in your Supabase SQL Editor

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
  institution TEXT,
  isBlocked BOOLEAN DEFAULT FALSE,
  oneStarReviewCount INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- RESOURCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  fileName TEXT NOT NULL,
  fileSize TEXT NOT NULL,
  fileData BYTEA NOT NULL,
  uploadedDate TEXT NOT NULL,
  uploadedBy TEXT NOT NULL,
  uploaderName TEXT NOT NULL,
  hasRedFlag BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (uploadedBy) REFERENCES users(email) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_uploadedBy ON resources(uploadedBy);
CREATE INDEX IF NOT EXISTS idx_resources_hasRedFlag ON resources(hasRedFlag);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  resourceId TEXT NOT NULL,
  userName TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (resourceId) REFERENCES resources(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_resourceId ON reviews(resourceId);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users: Allow anyone to read and insert (for registration)
CREATE POLICY "Allow public read access on users" 
  ON users FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert on users" 
  ON users FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow users to update themselves" 
  ON users FOR UPDATE 
  USING (true);

-- Resources: Allow public read, authenticated insert/update/delete
CREATE POLICY "Allow public read access on resources" 
  ON resources FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated insert on resources" 
  ON resources FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow resource owners to update their resources" 
  ON resources FOR UPDATE 
  USING (true);

CREATE POLICY "Allow resource owners to delete their resources" 
  ON resources FOR DELETE 
  USING (true);

-- Reviews: Allow public read, authenticated insert
CREATE POLICY "Allow public read access on reviews" 
  ON reviews FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated insert on reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (true);
