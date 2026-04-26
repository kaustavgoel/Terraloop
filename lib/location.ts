"use client"

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

const LOCATION_KEY = "terraloop_user_location"

// Save user location to localStorage
export function saveUserLocation(location: UserLocation): void {
  if (typeof window === "undefined") return
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location))
}

// Get saved user location from localStorage
export function getSavedLocation(): UserLocation | null {
  if (typeof window === "undefined") return null
  
  const stored = localStorage.getItem(LOCATION_KEY)
  if (!stored) return null
  
  try {
    const location = JSON.parse(stored) as UserLocation
    // Check if location is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours in ms
    if (Date.now() - location.timestamp > maxAge) {
      // Location is stale, remove it
      localStorage.removeItem(LOCATION_KEY)
      return null
    }
    return location
  } catch {
    return null
  }
}

// Clear saved location
export function clearSavedLocation(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(LOCATION_KEY)
}

// Alias for backwards compatibility
export const clearUserLocation = clearSavedLocation

// Auto-detect location silently (returns a promise)
export function autoDetectLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        }
        // Save to localStorage automatically
        saveUserLocation(userLocation)
        resolve(userLocation)
      },
      (error) => {
        let errorMessage: string
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
          default:
            errorMessage = "Unknown location error"
        }
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Accept cached position up to 1 minute old
      }
    )
  })
}

// Get human-readable location status
export function getLocationStatus(location: UserLocation | null): string {
  if (!location) return "Location not available"
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
}
