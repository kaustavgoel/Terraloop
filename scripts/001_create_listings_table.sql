-- Create the listings table (without PostGIS dependency)
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
  -- Geospatial fields (plain numeric, no PostGIS)
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  -- User reference (optional)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_listings_lat_lng ON listings (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_listings_sold ON listings (sold);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings (category);
CREATE INDEX IF NOT EXISTS idx_listings_listed_at ON listings (listed_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_grocer_phone ON listings (grocer_phone);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view all listings (marketplace is public)
CREATE POLICY "Anyone can view listings"
  ON listings FOR SELECT
  USING (true);

-- Anyone can insert listings (for easier demo - in production, restrict to authenticated)
CREATE POLICY "Anyone can insert listings"
  ON listings FOR INSERT
  WITH CHECK (true);

-- Anyone can update listings (for demo purposes)
CREATE POLICY "Anyone can update listings"
  ON listings FOR UPDATE
  USING (true);

-- Anyone can delete listings (for demo purposes)
CREATE POLICY "Anyone can delete listings"
  ON listings FOR DELETE
  USING (true);
