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
