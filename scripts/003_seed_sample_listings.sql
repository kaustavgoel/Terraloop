-- Seed sample listings with realistic Indian locations
-- These are scattered around major Indian cities for testing

INSERT INTO listings (
  fruit_name, category, freshness, shelf_life, verdict, images, recommended_uses,
  grocer_name, grocer_phone, grocer_location, price, base_price, price_margin, quantity,
  latitude, longitude
) VALUES
-- Chandigarh area
('Mango', 'climacteric', 9.2, '5-7 days', 'Premium Alphonso mangoes, perfectly ripe', 
  ARRAY['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Smoothies', 'Desserts'],
  'Sharma Fruits', '9876543210', 'Sector 17, Chandigarh', 150, 150, 45, 25,
  30.7410, 76.7680),

('Banana', 'climacteric', 8.5, '3-5 days', 'Fresh yellow bananas from Kerala',
  ARRAY['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Smoothies', 'Baking'],
  'Gupta Store', '9876543211', 'Sector 22, Chandigarh', 60, 60, 20, 50,
  30.7333, 76.7794),

-- Delhi area
('Apple', 'non-climacteric', 9.0, '2-3 weeks', 'Crisp Shimla apples, hand-picked',
  ARRAY['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Salads', 'Juicing'],
  'Fresh Farms Delhi', '9876543212', 'Connaught Place, Delhi', 180, 180, 50, 40,
  28.6315, 77.2167),

('Orange', 'non-climacteric', 8.8, '2-3 weeks', 'Nagpur oranges, sweet and juicy',
  ARRAY['https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Juicing', 'Salads'],
  'Citrus Hub', '9876543213', 'Chandni Chowk, Delhi', 100, 100, 30, 35,
  28.6506, 77.2334),

-- Mumbai area
('Papaya', 'climacteric', 8.2, '4-6 days', 'Sweet Mumbai papaya, ready to eat',
  ARRAY['https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Smoothies', 'Face Mask'],
  'Tropical Fruits Mumbai', '9876543214', 'Bandra West, Mumbai', 80, 80, 25, 20,
  19.0596, 72.8295),

('Grapes', 'non-climacteric', 9.5, '1-2 weeks', 'Nashik seedless grapes, export quality',
  ARRAY['https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Salads', 'Wine Making'],
  'Vineyard Fresh', '9876543215', 'Juhu, Mumbai', 200, 200, 60, 30,
  19.1075, 72.8263),

-- Bangalore area
('Avocado', 'climacteric', 8.0, '3-5 days', 'Coorg avocados, creamy and fresh',
  ARRAY['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Guacamole', 'Salads'],
  'Green Basket', '9876543216', 'Indiranagar, Bangalore', 250, 250, 70, 15,
  12.9716, 77.6412),

('Pomegranate', 'non-climacteric', 9.3, '2-3 weeks', 'Ruby red pomegranates from Karnataka',
  ARRAY['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Juicing', 'Salads'],
  'Karnataka Fruits', '9876543217', 'Koramangala, Bangalore', 160, 160, 40, 25,
  12.9352, 77.6245),

-- Kolkata area
('Litchi', 'non-climacteric', 9.8, '1 week', 'Muzaffarpur litchis, seasonal special',
  ARRAY['https://images.unsplash.com/photo-1622966954989-6a5e4e0c1e3e?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Desserts', 'Cocktails'],
  'Bengal Fruits', '9876543218', 'Park Street, Kolkata', 220, 220, 55, 20,
  22.5518, 88.3528),

('Jackfruit', 'climacteric', 8.7, '3-5 days', 'Sweet jackfruit from Bengal',
  ARRAY['https://images.unsplash.com/photo-1598493111470-2c0c71c37f77?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Cooking', 'Chips'],
  'Eastern Harvest', '9876543219', 'Salt Lake, Kolkata', 120, 120, 35, 10,
  22.5805, 88.4151),

-- Hyderabad area
('Watermelon', 'non-climacteric', 9.1, '1-2 weeks', 'Juicy watermelon, perfect for summer',
  ARRAY['https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Juicing', 'Salads'],
  'Hyderabad Fresh', '9876543220', 'Jubilee Hills, Hyderabad', 40, 40, 15, 30,
  17.4326, 78.4071),

('Sapota', 'climacteric', 8.4, '3-5 days', 'Chikoo from Andhra, honey sweet',
  ARRAY['https://images.unsplash.com/photo-1605027540204-8adc67facc27?w=400&h=400&fit=crop'],
  ARRAY['Fresh Eating', 'Milkshakes', 'Desserts'],
  'Deccan Fruits', '9876543221', 'Banjara Hills, Hyderabad', 90, 90, 25, 20,
  17.4156, 78.4347)

ON CONFLICT DO NOTHING;
