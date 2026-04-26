-- Create the get_nearby_listings RPC function using Haversine formula (no PostGIS)
-- This function returns listings within a specified radius from the user's location
CREATE OR REPLACE FUNCTION get_nearby_listings(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 10
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
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_km DOUBLE PRECISION
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  WITH distances AS (
    SELECT
      l.*,
      -- Haversine formula to calculate distance in km
      (
        6371 * acos(
          LEAST(1.0, GREATEST(-1.0,
            cos(radians(user_lat)) * cos(radians(l.latitude)) *
            cos(radians(l.longitude) - radians(user_lng)) +
            sin(radians(user_lat)) * sin(radians(l.latitude))
          ))
        )
      ) AS calc_distance_km
    FROM listings l
    WHERE 
      l.sold = FALSE
      AND l.quantity > 0
      -- Bounding box pre-filter for performance (approximate)
      AND l.latitude BETWEEN user_lat - (radius_km / 111.0) AND user_lat + (radius_km / 111.0)
      AND l.longitude BETWEEN user_lng - (radius_km / (111.0 * GREATEST(cos(radians(user_lat)), 0.01))) 
                          AND user_lng + (radius_km / (111.0 * GREATEST(cos(radians(user_lat)), 0.01)))
  )
  SELECT
    d.id,
    d.fruit_name,
    d.category,
    d.freshness,
    d.shelf_life,
    d.verdict,
    d.images,
    d.recommended_uses,
    d.grocer_name,
    d.grocer_phone,
    d.grocer_location,
    d.price,
    d.base_price,
    d.price_margin,
    d.quantity,
    d.sold,
    d.listed_at,
    d.latitude,
    d.longitude,
    ROUND(d.calc_distance_km::NUMERIC, 2) AS distance_km
  FROM distances d
  WHERE d.calc_distance_km <= radius_km
  ORDER BY d.calc_distance_km ASC, d.listed_at DESC;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION get_nearby_listings(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) TO anon;
GRANT EXECUTE ON FUNCTION get_nearby_listings(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;
