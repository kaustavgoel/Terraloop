-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the listings table with geospatial support
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fruit_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('climacteric', 'non-climacteric')),
  freshness NUMERIC(3,1) NOT NULL CHECK (freshness >= 0 AND freshness <= 10),
  shelf_life TEXT,
  verdict TEXT,
  images TEXT[] DEFAULT '{}',
  recommended_uses TEXT[] DEFAULT '{}',
  grocer_name TEXT NOT NULL,
  grocer_phone TEXT NOT NULL,
  grocer_location TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  price_margin NUMERIC(10,2) DEFAULT 45,
  quantity INTEGER NOT NULL DEFAULT 1,
  sold BOOLEAN DEFAULT FALSE,
  listed_at TIMESTAMPTZ DEFAULT NOW(),
  -- Geospatial fields
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  ) STORED,
  -- User reference (optional - for RLS)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create spatial index for fast geofencing queries
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings USING GIST (location);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_listings_sold ON listings (sold);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings (category);
CREATE INDEX IF NOT EXISTS idx_listings_listed_at ON listings (listed_at DESC);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view available (not sold) listings
CREATE POLICY "Anyone can view available listings"
  ON listings FOR SELECT
  USING (sold = FALSE);

-- Authenticated users can insert their own listings
CREATE POLICY "Authenticated users can insert own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
