"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

// Listing type from database
export interface GeoListing {
  id: string
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
  listed_at: string
  latitude: number
  longitude: number
  distance_km: number
}

export interface GeoLocation {
  latitude: number
  longitude: number
  accuracy: number
}

export interface UseGeofencedListingsOptions {
  radiusKm?: number
  enableRealTimeTracking?: boolean
  minMovementMeters?: number
}

export interface UseGeofencedListingsReturn {
  listings: GeoListing[]
  isLoading: boolean
  error: string | null
  location: GeoLocation | null
  locationError: string | null
  isLocationTracking: boolean
  refetch: () => Promise<void>
  startTracking: () => void
  stopTracking: () => void
}

// Calculate distance between two coordinates in meters using Haversine formula
function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function useGeofencedListings(
  options: UseGeofencedListingsOptions = {}
): UseGeofencedListingsReturn {
  const {
    radiusKm = 10,
    enableRealTimeTracking = true,
    minMovementMeters = 100,
  } = options

  const [listings, setListings] = useState<GeoListing[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<GeoLocation | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLocationTracking, setIsLocationTracking] = useState(false)

  // Refs to track previous location and watch ID
  const lastFetchLocation = useRef<{ lat: number; lng: number } | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const supabase = useRef(createClient())

  // Fetch listings from Supabase RPC
  const fetchListings = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const { data, error: rpcError } = await supabase.current.rpc(
          "get_nearby_listings",
          {
            user_lat: lat,
            user_lng: lng,
            radius_km: radiusKm,
          }
        )

        if (rpcError) {
          throw new Error(rpcError.message)
        }

        setListings(data || [])
        lastFetchLocation.current = { lat, lng }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch listings")
        console.error("[v0] Error fetching geofenced listings:", err)
      } finally {
        setIsLoading(false)
      }
    },
    [radiusKm]
  )

  // Manual refetch function
  const refetch = useCallback(async () => {
    if (location) {
      await fetchListings(location.latitude, location.longitude)
    }
  }, [location, fetchListings])

  // Handle position update from geolocation
  const handlePositionUpdate = useCallback(
    (position: GeolocationPosition) => {
      const newLocation: GeoLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }

      setLocation(newLocation)
      setLocationError(null)

      // Check if user has moved more than threshold
      const shouldFetch =
        !lastFetchLocation.current ||
        calculateDistanceMeters(
          lastFetchLocation.current.lat,
          lastFetchLocation.current.lng,
          newLocation.latitude,
          newLocation.longitude
        ) >= minMovementMeters

      if (shouldFetch) {
        fetchListings(newLocation.latitude, newLocation.longitude)
      }
    },
    [fetchListings, minMovementMeters]
  )

  // Handle geolocation errors
  const handlePositionError = useCallback((error: GeolocationPositionError) => {
    let errorMessage: string

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location access denied. Please enable location permissions."
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable."
        break
      case error.TIMEOUT:
        errorMessage = "Location request timed out."
        break
      default:
        errorMessage = "An unknown error occurred while getting location."
    }

    setLocationError(errorMessage)
    console.error("[v0] Geolocation error:", errorMessage)
  }, [])

  // Start tracking location
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return
    }

    if (watchIdRef.current !== null) {
      return // Already tracking
    }

    setIsLocationTracking(true)

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      handlePositionUpdate,
      handlePositionError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )

    // Start watching position if real-time tracking is enabled
    if (enableRealTimeTracking) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handlePositionError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000, // Accept cached position up to 5 seconds old
        }
      )
    }
  }, [handlePositionUpdate, handlePositionError, enableRealTimeTracking])

  // Stop tracking location
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsLocationTracking(false)
  }, [])

  // Auto-start tracking on mount if enabled
  useEffect(() => {
    if (enableRealTimeTracking) {
      startTracking()
    }

    return () => {
      stopTracking()
    }
  }, [enableRealTimeTracking, startTracking, stopTracking])

  // Listen for marketplace updates (when items are purchased)
  useEffect(() => {
    const handleMarketplaceUpdate = () => {
      refetch()
    }

    window.addEventListener("marketplaceUpdated", handleMarketplaceUpdate)

    return () => {
      window.removeEventListener("marketplaceUpdated", handleMarketplaceUpdate)
    }
  }, [refetch])

  return {
    listings,
    isLoading,
    error,
    location,
    locationError,
    isLocationTracking,
    refetch,
    startTracking,
    stopTracking,
  }
}

// Helper hook to convert GeoListing to the existing MarketplaceItem format
export function useMarketplaceListings(options?: UseGeofencedListingsOptions) {
  const geofencedData = useGeofencedListings(options)

  // Convert GeoListing to MarketplaceItem format for easy drop-in replacement
  const marketplaceItems = geofencedData.listings.map((listing) => ({
    id: listing.id,
    type: "listing" as const,
    name: listing.fruit_name,
    category: listing.category,
    image:
      listing.images[0] ||
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop",
    description: listing.verdict || `Fresh ${listing.fruit_name} from local grocer`,
    price: listing.price,
    unit: "kg",
    freshness: listing.freshness,
    inStock: !listing.sold,
    quantity: listing.quantity || 1,
    sellerName: listing.grocer_name,
    sellerPhone: listing.grocer_phone,
    sellerAddress: listing.grocer_location,
    distanceKm: listing.distance_km,
    latitude: listing.latitude,
    longitude: listing.longitude,
  }))

  return {
    ...geofencedData,
    marketplaceItems,
  }
}
