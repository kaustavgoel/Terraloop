-- Create the get_nearby_listings stored procedure (RPC)
-- This function returns sellers within a specified radius from the user's location
CREATE OR REPLACE FUNCTION get_nearby_listings(
  user_lat NUMERIC,
  user_lng NUMERIC,
  radius_km NUMERIC DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  fruit_name TEXT,
  category TEXT,
  freshness NUMERIC,
  shelf_life TEXT,
  verdict TEXT,
  images TEXT[],
  recommended_uses TEXT[],
  grocer_name TEXT,
  grocer_phone TEXT,
  grocer_location TEXT,
  price NUMERIC,
  base_price NUMERIC,
  price_margin NUMERIC,
  quantity INTEGER,
  sold BOOLEAN,
  listed_at TIMESTAMPTZ,
  latitude NUMERIC,
  longitude NUMERIC,
  distance_km NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    l.grocer_name,
    l.grocer_phone,
    l.grocer_location,
    l.price,
    l.base_price,
    l.price_margin,
    l.quantity,
    l.sold,
    l.listed_at,
    l.latitude,
    l.longitude,
    -- Calculate distance in kilometers
    ROUND((ST_Distance(
      l.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000)::NUMERIC, 2) AS distance_km
  FROM listings l
  WHERE 
    l.sold = FALSE
    AND ST_DWithin(
      l.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000  -- Convert km to meters
    )
  ORDER BY distance_km ASC, l.listed_at DESC;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION get_nearby_listings(NUMERIC, NUMERIC, NUMERIC) TO anon;
GRANT EXECUTE ON FUNCTION get_nearby_listings(NUMERIC, NUMERIC, NUMERIC) TO authenticated;
