// Random Indian names for sellers
const SELLER_NAMES = [
  "Rajesh Kumar",
  "Priya Sharma",
  "Amit Patel",
  "Sunita Verma",
  "Vikram Singh",
  "Anita Gupta",
  "Suresh Reddy",
  "Meena Iyer",
  "Deepak Joshi",
  "Kavita Nair",
  "Ramesh Yadav",
  "Pooja Mishra",
  "Arun Chopra",
  "Lakshmi Menon",
  "Sanjay Dubey",
  "Geeta Pillai",
]

// Random phone numbers (Indian format)
const SELLER_PHONES = [
  "9876543210",
  "9123456789",
  "9988776655",
  "9012345678",
  "9765432109",
  "9654321098",
  "9543210987",
  "9432109876",
  "9321098765",
  "9210987654",
  "9109876543",
  "9001234567",
  "9898989898",
  "9797979797",
  "9696969696",
  "9595959595",
]

// Random addresses
const SELLER_ADDRESSES = [
  "Sector 17, Chandigarh",
  "MG Road, Bangalore",
  "Connaught Place, Delhi",
  "Bandra West, Mumbai",
  "Park Street, Kolkata",
  "Jubilee Hills, Hyderabad",
  "Anna Nagar, Chennai",
  "Koregaon Park, Pune",
  "Ashram Road, Ahmedabad",
  "Civil Lines, Jaipur",
  "Hazratganj, Lucknow",
  "Camp Area, Pune",
  "Salt Lake, Kolkata",
  "Indiranagar, Bangalore",
  "Karol Bagh, Delhi",
  "Andheri West, Mumbai",
]

// Helper to get random item from array with seed
function getSeededRandom(seed: number, array: string[]): string {
  return array[seed % array.length]
}

export interface Fruit {
  id: string
  name: string
  category: "climacteric" | "non-climacteric"
  image: string
  description: string
  price: number
  unit: string
  freshness: number
  inStock: boolean
  quantity: number
  sellerName: string
  sellerPhone: string
  sellerAddress: string
}

export const fruits: Fruit[] = [
  // Climacteric fruits (continue ripening after harvest)
  {
    id: "apple-1",
    name: "Red Apple",
    category: "climacteric",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
    description: "Fresh, crisp red apples perfect for snacking or baking",
    price: 180,
    unit: "kg",
    freshness: 9.5,
    inStock: true,
    sellerName: getSeededRandom(0, SELLER_NAMES),
    sellerPhone: getSeededRandom(0, SELLER_PHONES),
    sellerAddress: getSeededRandom(0, SELLER_ADDRESSES),
  },
  {
    id: "banana-1",
    name: "Banana",
    category: "climacteric",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    description: "Perfectly ripe bananas, rich in potassium",
    price: 45,
    unit: "dozen",
    freshness: 8.8,
    inStock: true,
    sellerName: getSeededRandom(1, SELLER_NAMES),
    sellerPhone: getSeededRandom(1, SELLER_PHONES),
    sellerAddress: getSeededRandom(1, SELLER_ADDRESSES),
  },
  {
    id: "mango-1",
    name: "Mango",
    category: "climacteric",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop",
    description: "Sweet and juicy tropical mangoes",
    price: 120,
    unit: "kg",
    freshness: 9.2,
    inStock: true,
    sellerName: getSeededRandom(2, SELLER_NAMES),
    sellerPhone: getSeededRandom(2, SELLER_PHONES),
    sellerAddress: getSeededRandom(2, SELLER_ADDRESSES),
  },
  {
    id: "avocado-1",
    name: "Avocado",
    category: "climacteric",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop",
    description: "Creamy Hass avocados, perfect for guacamole",
    price: 250,
    unit: "kg",
    freshness: 8.5,
    inStock: true,
    sellerName: getSeededRandom(3, SELLER_NAMES),
    sellerPhone: getSeededRandom(3, SELLER_PHONES),
    sellerAddress: getSeededRandom(3, SELLER_ADDRESSES),
  },
  {
    id: "peach-1",
    name: "Peach",
    category: "climacteric",
    image: "https://images.unsplash.com/photo-1629226182702-7e3a92e4a89f?w=400&h=400&fit=crop",
    description: "Juicy summer peaches with a sweet aroma",
    price: 220,
    unit: "kg",
    freshness: 9.0,
    inStock: true,
    sellerName: getSeededRandom(4, SELLER_NAMES),
    sellerPhone: getSeededRandom(4, SELLER_PHONES),
    sellerAddress: getSeededRandom(4, SELLER_ADDRESSES),
  },
  {
    id: "papaya-1",
    name: "Papaya",
    category: "climacteric",
    image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=400&fit=crop",
    description: "Tropical papaya, great for smoothies",
    price: 60,
    unit: "kg",
    freshness: 8.7,
    inStock: false,
    sellerName: getSeededRandom(5, SELLER_NAMES),
    sellerPhone: getSeededRandom(5, SELLER_PHONES),
    sellerAddress: getSeededRandom(5, SELLER_ADDRESSES),
  },
  {
    id: "pear-1",
    name: "Pear",
    category: "climacteric",
    image: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400&h=400&fit=crop",
    description: "Sweet and tender Bartlett pears",
    price: 160,
    unit: "kg",
    freshness: 9.1,
    inStock: true,
    sellerName: getSeededRandom(6, SELLER_NAMES),
    sellerPhone: getSeededRandom(6, SELLER_PHONES),
    sellerAddress: getSeededRandom(6, SELLER_ADDRESSES),
  },
  {
    id: "kiwi-1",
    name: "Kiwi",
    category: "climacteric",
    image: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&h=400&fit=crop",
    description: "Tangy and nutritious kiwi fruit",
    price: 200,
    unit: "kg",
    freshness: 9.3,
    inStock: true,
    sellerName: getSeededRandom(7, SELLER_NAMES),
    sellerPhone: getSeededRandom(7, SELLER_PHONES),
    sellerAddress: getSeededRandom(7, SELLER_ADDRESSES),
  },
  // Non-climacteric fruits (do not ripen after harvest)
  {
    id: "orange-1",
    name: "Orange",
    category: "non-climacteric",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop",
    description: "Juicy navel oranges, high in vitamin C",
    price: 80,
    unit: "kg",
    freshness: 9.4,
    inStock: true,
    sellerName: getSeededRandom(8, SELLER_NAMES),
    sellerPhone: getSeededRandom(8, SELLER_PHONES),
    sellerAddress: getSeededRandom(8, SELLER_ADDRESSES),
  },
  {
    id: "strawberry-1",
    name: "Strawberry",
    category: "non-climacteric",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
    description: "Fresh, red strawberries perfect for desserts",
    price: 350,
    unit: "kg",
    freshness: 8.8,
    inStock: true,
    sellerName: getSeededRandom(9, SELLER_NAMES),
    sellerPhone: getSeededRandom(9, SELLER_PHONES),
    sellerAddress: getSeededRandom(9, SELLER_ADDRESSES),
  },
  {
    id: "grape-1",
    name: "Grapes",
    category: "non-climacteric",
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop",
    description: "Sweet seedless green grapes",
    price: 120,
    unit: "kg",
    freshness: 9.2,
    inStock: true,
    sellerName: getSeededRandom(10, SELLER_NAMES),
    sellerPhone: getSeededRandom(10, SELLER_PHONES),
    sellerAddress: getSeededRandom(10, SELLER_ADDRESSES),
  },
  {
    id: "watermelon-1",
    name: "Watermelon",
    category: "non-climacteric",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    description: "Refreshing seedless watermelon",
    price: 35,
    unit: "kg",
    freshness: 9.6,
    inStock: true,
    sellerName: getSeededRandom(11, SELLER_NAMES),
    sellerPhone: getSeededRandom(11, SELLER_PHONES),
    sellerAddress: getSeededRandom(11, SELLER_ADDRESSES),
  },
  {
    id: "pineapple-1",
    name: "Pineapple",
    category: "non-climacteric",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop",
    description: "Sweet golden pineapple from Costa Rica",
    price: 70,
    unit: "piece",
    freshness: 8.9,
    inStock: true,
    sellerName: getSeededRandom(12, SELLER_NAMES),
    sellerPhone: getSeededRandom(12, SELLER_PHONES),
    sellerAddress: getSeededRandom(12, SELLER_ADDRESSES),
  },
  {
    id: "cherry-1",
    name: "Cherry",
    category: "non-climacteric",
    image: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=400&fit=crop",
    description: "Dark sweet cherries, perfect for snacking",
    price: 800,
    unit: "kg",
    freshness: 8.5,
    inStock: false,
    sellerName: getSeededRandom(13, SELLER_NAMES),
    sellerPhone: getSeededRandom(13, SELLER_PHONES),
    sellerAddress: getSeededRandom(13, SELLER_ADDRESSES),
  },
  {
    id: "lemon-1",
    name: "Lemon",
    category: "non-climacteric",
    image: "https://images.unsplash.com/photo-1582087463261-ddea03f80f5d?w=400&h=400&fit=crop",
    description: "Fresh lemons for cooking and drinks",
    price: 60,
    unit: "kg",
    freshness: 9.7,
    inStock: true,
    sellerName: getSeededRandom(14, SELLER_NAMES),
    sellerPhone: getSeededRandom(14, SELLER_PHONES),
    sellerAddress: getSeededRandom(14, SELLER_ADDRESSES),
  },
  {
    id: "pomegranate-1",
    name: "Pomegranate",
    category: "non-climacteric",
    image: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=400&h=400&fit=crop",
    description: "Antioxidant-rich pomegranate seeds",
    price: 180,
    unit: "kg",
    freshness: 9.0,
    inStock: true,
    sellerName: getSeededRandom(15, SELLER_NAMES),
    sellerPhone: getSeededRandom(15, SELLER_PHONES),
    sellerAddress: getSeededRandom(15, SELLER_ADDRESSES),
  },
]

export function getFruitsByCategory(category: "climacteric" | "non-climacteric"): Fruit[] {
  return fruits.filter((fruit) => fruit.category === category)
}

export function getCategoryInfo(category: "climacteric" | "non-climacteric") {
  if (category === "climacteric") {
    return {
      title: "Climacteric Fruits",
      description: "Fruits that continue to ripen after harvest due to ethylene production",
      tips: [
        "Store unripe fruits at room temperature to speed ripening",
        "Place in a paper bag with a banana to ripen faster",
        "Refrigerate once ripe to extend shelf life",
      ],
    }
  }
  return {
    title: "Non-Climacteric Fruits",
    description: "Fruits that do not ripen after harvest and should be picked when ready",
    tips: [
      "Always purchase when fully ripe",
      "Refrigerate immediately to maintain freshness",
      "Best consumed within a few days of purchase",
    ],
  }
}
