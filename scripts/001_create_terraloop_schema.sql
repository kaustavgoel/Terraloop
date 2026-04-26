-- Enable PostGIS extension for geospatial functions
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create users table for both grocers and buyers
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('grocer', 'buyer')),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_verified BOOLEAN DEFAULT FALSE,
  location_verified_at TIMESTAMPTZ,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create listings table for grocer listings with location
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grocer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  fruit_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('climacteric', 'non-climacteric')),
  freshness INTEGER NOT NULL CHECK (freshness >= 1 AND freshness <= 10),
  shelf_life TEXT,
  verdict TEXT,
  images TEXT[] DEFAULT '{}',
  recommended_uses TEXT[] DEFAULT '{}',
  price DECIMAL(10, 2) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  price_margin DECIMAL(10, 2) DEFAULT 45.00,
  quantity INTEGER NOT NULL DEFAULT 1,
  sold BOOLEAN DEFAULT FALSE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_point GEOGRAPHY(POINT, 4326),
  listed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table for purchase tracking
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  buyer_qr TEXT NOT NULL,
  grocer_qr TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create location verification logs
CREATE TABLE IF NOT EXISTS public.location_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_verifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "users_select_all" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_delete_own" ON public.users FOR DELETE USING (auth.uid() = id);

-- Listings policies - anyone can view available listings
CREATE POLICY "listings_select_all" ON public.listings FOR SELECT USING (true);
CREATE POLICY "listings_insert_own" ON public.listings FOR INSERT WITH CHECK (auth.uid() = grocer_id);
CREATE POLICY "listings_update_own" ON public.listings FOR UPDATE USING (auth.uid() = grocer_id);
CREATE POLICY "listings_delete_own" ON public.listings FOR DELETE USING (auth.uid() = grocer_id);

-- Orders policies
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "orders_update_own" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id);

-- Order items policies
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.buyer_id = auth.uid()));
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.buyer_id = auth.uid()));

-- Location verifications policies
CREATE POLICY "location_verifications_select_own" ON public.location_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "location_verifications_insert_own" ON public.location_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_listings_grocer ON public.listings (grocer_id);
CREATE INDEX IF NOT EXISTS idx_listings_sold ON public.listings (sold) WHERE sold = FALSE;
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders (buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);

-- Trigger to auto-update location_point when lat/lng changes
CREATE OR REPLACE FUNCTION update_listing_location_point()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location_point = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_listing_location ON public.listings;
CREATE TRIGGER trigger_update_listing_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_location_point();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON public.users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to get nearby listings within a radius (in km)
CREATE OR REPLACE FUNCTION get_nearby_listings(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 2.5
)
RETURNS TABLE (
  id UUID,
  fruit_name TEXT,
  category TEXT,
  freshness INTEGER,
  shelf_life TEXT,
  verdict TEXT,
  images TEXT[],
  recommended_uses TEXT[],
  grocer_name TEXT,
  grocer_phone TEXT,
  grocer_location TEXT,
  price DECIMAL,
  base_price DECIMAL,
  price_margin DECIMAL,
  quantity INTEGER,
  sold BOOLEAN,
  listed_at TIMESTAMPTZ,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.fruit_name,
    l.category,
    l.freshness,
    l.shelf_life,
    l.verdict,
    l.images,
    l.recommended_uses,
    u.name AS grocer_name,
    u.phone AS grocer_phone,
    COALESCE(u.address, 'Location verified') AS grocer_location,
    l.price,
    l.base_price,
    l.price_margin,
    l.quantity,
    l.sold,
    l.listed_at,
    l.latitude,
    l.longitude,
    ROUND((ST_Distance(
      l.location_point,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000)::numeric, 2) AS distance_km
  FROM public.listings l
  JOIN public.users u ON l.grocer_id = u.id
  WHERE 
    l.sold = FALSE
    AND l.quantity > 0
    AND ST_DWithin(
      l.location_point,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000  -- Convert km to meters
    )
  ORDER BY distance_km ASC, l.listed_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get nearby grocers within a radius
CREATE OR REPLACE FUNCTION get_nearby_grocers(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 2.5
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  phone TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_verified BOOLEAN,
  listing_count BIGINT,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.phone,
    u.address,
    u.latitude,
    u.longitude,
    u.location_verified,
    COUNT(l.id) AS listing_count,
    ROUND((
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(u.latitude)) *
        cos(radians(u.longitude) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(u.latitude))
      )
    )::numeric, 2) AS distance_km
  FROM public.users u
  LEFT JOIN public.listings l ON u.id = l.grocer_id AND l.sold = FALSE AND l.quantity > 0
  WHERE 
    u.role = 'grocer'
    AND u.location_verified = TRUE
    AND u.latitude IS NOT NULL
    AND u.longitude IS NOT NULL
    AND (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(u.latitude)) *
        cos(radians(u.longitude) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(u.latitude))
      )
    ) <= radius_km
  GROUP BY u.id, u.name, u.phone, u.address, u.latitude, u.longitude, u.location_verified
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify user location
CREATE OR REPLACE FUNCTION verify_user_location(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  user_accuracy DOUBLE PRECISION DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update user's location
  UPDATE public.users
  SET 
    latitude = user_lat,
    longitude = user_lng,
    location_verified = TRUE,
    location_verified_at = NOW(),
    updated_at = NOW()
  WHERE id = current_user_id;
  
  -- Log the verification
  INSERT INTO public.location_verifications (user_id, latitude, longitude, accuracy)
  VALUES (current_user_id, user_lat, user_lng, user_accuracy);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get verified users (grocers and buyers) in an area
CREATE OR REPLACE FUNCTION get_verified_users_in_area(
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 2.5,
  user_role TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  phone TEXT,
  role TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_verified BOOLEAN,
  location_verified_at TIMESTAMPTZ,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.phone,
    u.role,
    u.address,
    u.latitude,
    u.longitude,
    u.location_verified,
    u.location_verified_at,
    ROUND((
      6371 * acos(
        cos(radians(center_lat)) * cos(radians(u.latitude)) *
        cos(radians(u.longitude) - radians(center_lng)) +
        sin(radians(center_lat)) * sin(radians(u.latitude))
      )
    )::numeric, 2) AS distance_km
  FROM public.users u
  WHERE 
    u.location_verified = TRUE
    AND u.latitude IS NOT NULL
    AND u.longitude IS NOT NULL
    AND (user_role IS NULL OR u.role = user_role)
    AND (
      6371 * acos(
        cos(radians(center_lat)) * cos(radians(u.latitude)) *
        cos(radians(u.longitude) - radians(center_lng)) +
        sin(radians(center_lat)) * sin(radians(u.latitude))
      )
    ) <= radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'buyer')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
