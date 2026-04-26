import { createClient } from "@/lib/supabase/client"
import { getSavedLocation } from "@/lib/location"

// Interface matching the Supabase listings table
export interface SupabaseListing {
  id?: string
  fruit_name: string
  category: "climacteric" | "non-climacteric"
  freshness: number
  shelf_life: string | null
  verdict: string | null
  images: string[]
  recommended_uses: string[]
  grocer_name: string
  grocer_phone: string
  grocer_location: string
  price: number
  base_price: number
  price_margin: number
  quantity: number
  sold: boolean
  latitude: number
  longitude: number
  listed_at?: string
  user_id?: string | null
}

// Interface for creating a new listing (from grocer page)
export interface CreateListingInput {
  fruitName: string
  category: "climacteric" | "non-climacteric"
  freshness: number
  shelfLife: string
  verdict: string
  images: string[]
  recommendedUses: string[]
  grocerName: string
  grocerPhone: string
  grocerLocation: string
  price: number
  quantity: number
}

// Create a new listing in Supabase
export async function createSupabaseListing(input: CreateListingInput): Promise<SupabaseListing | null> {
  const supabase = createClient()
  
  // Get user's current location
  const savedLocation = getSavedLocation()
  if (!savedLocation) {
    console.error("No location available for listing")
    return null
  }

  const listing: Omit<SupabaseListing, 'id' | 'listed_at' | 'user_id'> = {
    fruit_name: input.fruitName,
    category: input.category,
    freshness: input.freshness,
    shelf_life: input.shelfLife,
    verdict: input.verdict,
    images: input.images,
    recommended_uses: input.recommendedUses,
    grocer_name: input.grocerName,
    grocer_phone: input.grocerPhone,
    grocer_location: input.grocerLocation,
    price: input.price,
    base_price: input.price,
    price_margin: 45,
    quantity: input.quantity,
    sold: false,
    latitude: savedLocation.latitude,
    longitude: savedLocation.longitude,
  }

  const { data, error } = await supabase
    .from("listings")
    .insert([listing])
    .select()
    .single()

  if (error) {
    console.error("Error creating listing:", error)
    return null
  }

  return data as SupabaseListing
}

// Mark a listing as sold in Supabase
export async function markListingSold(listingId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from("listings")
    .update({ sold: true })
    .eq("id", listingId)

  if (error) {
    console.error("Error marking listing as sold:", error)
    return false
  }

  return true
}

// Update listing quantity in Supabase
export async function updateListingQuantity(listingId: string, quantity: number): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from("listings")
    .update({ 
      quantity,
      sold: quantity <= 0 
    })
    .eq("id", listingId)

  if (error) {
    console.error("Error updating listing quantity:", error)
    return false
  }

  return true
}

// Get grocer's own listings from Supabase
export async function getGrocerListingsFromSupabase(grocerPhone: string): Promise<SupabaseListing[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("grocer_phone", grocerPhone)
    .order("listed_at", { ascending: false })

  if (error) {
    console.error("Error fetching grocer listings:", error)
    return []
  }

  return data as SupabaseListing[]
}

// Seed dummy listings near a location (for demo purposes)
export async function seedNearbyListings(latitude: number, longitude: number): Promise<boolean> {
  const supabase = createClient()
  
  // Check if we already have listings near this location (within 10km)
  const { data: existingNearby } = await supabase.rpc("get_nearby_listings", {
    user_lat: latitude,
    user_lng: longitude,
    radius_km: 10,
  })
  
  // If there are already listings nearby, don't seed more
  if (existingNearby && existingNearby.length > 0) {
    return false
  }
  
  // Generate random offset (within 2km)
  const randomOffset = () => (Math.random() - 0.5) * 0.036 // ~2km in degrees
  
  const dummyListings = [
    {
      fruit_name: "Fresh Organic Apples",
      category: "climacteric" as const,
      freshness: 9.2,
      shelf_life: "7-10 days",
      verdict: "Premium quality, perfect crispness and sweetness",
      images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"],
      recommended_uses: ["Fresh eating", "Baking", "Salads", "Juicing"],
      grocer_name: "Green Valley Farm",
      grocer_phone: "9876543210",
      grocer_location: "Local Market, Near You",
      price: 180,
      base_price: 120,
      price_margin: 50,
      quantity: 50,
      sold: false,
      latitude: latitude + randomOffset(),
      longitude: longitude + randomOffset(),
    },
    {
      fruit_name: "Premium Mangoes",
      category: "climacteric" as const,
      freshness: 9.5,
      shelf_life: "5-7 days",
      verdict: "Excellent ripeness, aromatic and sweet",
      images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=400"],
      recommended_uses: ["Direct consumption", "Smoothies", "Desserts"],
      grocer_name: "Tropical Fruits Hub",
      grocer_phone: "9876543211",
      grocer_location: "Fresh Market, Nearby",
      price: 320,
      base_price: 200,
      price_margin: 60,
      quantity: 30,
      sold: false,
      latitude: latitude + randomOffset(),
      longitude: longitude + randomOffset(),
    },
    {
      fruit_name: "Organic Bananas",
      category: "climacteric" as const,
      freshness: 8.8,
      shelf_life: "4-5 days",
      verdict: "Naturally ripened, perfect for smoothies",
      images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400"],
      recommended_uses: ["Breakfast", "Smoothies", "Baking"],
      grocer_name: "Nature's Best",
      grocer_phone: "9876543212",
      grocer_location: "Organic Corner, Local Area",
      price: 60,
      base_price: 40,
      price_margin: 50,
      quantity: 100,
      sold: false,
      latitude: latitude + randomOffset(),
      longitude: longitude + randomOffset(),
    },
    {
      fruit_name: "Fresh Strawberries",
      category: "non-climacteric" as const,
      freshness: 9.0,
      shelf_life: "3-4 days",
      verdict: "Peak season, excellent sweetness",
      images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400"],
      recommended_uses: ["Fresh eating", "Desserts", "Smoothies"],
      grocer_name: "Berry Fresh",
      grocer_phone: "9876543213",
      grocer_location: "Farmers Market, Nearby",
      price: 280,
      base_price: 180,
      price_margin: 55,
      quantity: 25,
      sold: false,
      latitude: latitude + randomOffset(),
      longitude: longitude + randomOffset(),
    },
    {
      fruit_name: "Sweet Oranges",
      category: "non-climacteric" as const,
      freshness: 8.5,
      shelf_life: "10-14 days",
      verdict: "Juicy and vitamin-rich, perfect sweetness",
      images: ["https://images.unsplash.com/photo-1547514701-42782101795e?w=400"],
      recommended_uses: ["Fresh juice", "Direct consumption", "Salads"],
      grocer_name: "Citrus Garden",
      grocer_phone: "9876543214",
      grocer_location: "Local Produce Store",
      price: 120,
      base_price: 80,
      price_margin: 50,
      quantity: 75,
      sold: false,
      latitude: latitude + randomOffset(),
      longitude: longitude + randomOffset(),
    },
    {
      fruit_name: "Grapes - Seedless",
      category: "non-climacteric" as const,
      freshness: 9.1,
      shelf_life: "7-10 days",
      verdict: "Sweet and crisp, farm fresh",
      images: ["https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400"],
      recommended_uses: ["Fresh eating", "Salads", "Snacking"],
      grocer_name: "Vineyard Select",
      grocer_phone: "9876543215",
      grocer_location: "Fresh Produce Hub",
      price: 160,
      base_price: 100,
      price_margin: 60,
      quantity: 40,
      sold: false,
      latitude: latitude + randomOffset(),
      longitude: longitude + randomOffset(),
    },
  ]
  
  const { error } = await supabase.from("listings").insert(dummyListings)
  
  if (error) {
    console.error("Error seeding listings:", error)
    return false
  }
  
  return true
}

// Sync local listings to Supabase (for migration)
export async function syncLocalListingsToSupabase(): Promise<number> {
  const STORAGE_KEY = "terraloop_grocer_listings"
  
  if (typeof window === "undefined") return 0
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return 0
  
  const savedLocation = getSavedLocation()
  if (!savedLocation) return 0
  
  try {
    const localListings = JSON.parse(stored)
    let syncedCount = 0
    
    for (const listing of localListings) {
      if (!listing.synced) {
        const result = await createSupabaseListing({
          fruitName: listing.fruitName,
          category: listing.category,
          freshness: listing.freshness,
          shelfLife: listing.shelfLife,
          verdict: listing.verdict,
          images: listing.images,
          recommendedUses: listing.recommendedUses,
          grocerName: listing.grocerName,
          grocerPhone: listing.grocerPhone,
          grocerLocation: listing.grocerLocation,
          price: listing.price,
          quantity: listing.quantity || 1,
        })
        
        if (result) {
          listing.synced = true
          listing.supabaseId = result.id
          syncedCount++
        }
      }
    }
    
    // Update local storage with synced status
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localListings))
    
    return syncedCount
  } catch {
    return 0
  }
}
