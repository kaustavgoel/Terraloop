"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { getSavedLocation, saveUserLocation, clearUserLocation, type UserLocation } from "@/lib/location"

// Session storage key
const SESSION_KEY = "terraloop_session"
const USER_KEY = "terraloop_user"

// User profile interface
export interface UserProfile {
  phone: string
  name: string
  role: "grocer" | "buyer" | null
  isVerified: boolean
  verifiedAt?: number
}

// Session interface
export interface UserSession {
  userId: string
  phone: string
  name: string
  role: "grocer" | "buyer" | null
  isVerified: boolean
  createdAt: number
  expiresAt: number
}

// Context state interface
interface UserContextState {
  // Auth state
  user: UserProfile | null
  session: UserSession | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Location state
  currentLocation: UserLocation | null
  isLocationTracking: boolean
  locationError: string | null
  
  // Auth actions
  login: (phone: string, name: string) => void
  verifyOTP: (otp: string) => Promise<boolean>
  setRole: (role: "grocer" | "buyer") => void
  logout: () => void
  
  // Location actions
  startLocationTracking: () => void
  stopLocationTracking: () => void
  
  // Geofencing config (easily adjustable)
  GEOFENCE_RADIUS_KM: number
}

// Default values
const defaultContext: UserContextState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  currentLocation: null,
  isLocationTracking: false,
  locationError: null,
  login: () => {},
  verifyOTP: async () => false,
  setRole: () => {},
  logout: () => {},
  startLocationTracking: () => {},
  stopLocationTracking: () => {},
  GEOFENCE_RADIUS_KM: 2.5, // Default 2.5km radius - easily adjustable
}

// Create context
const UserContext = createContext<UserContextState>(defaultContext)

// Geofence radius - easily adjustable
const GEOFENCE_RADIUS_KM = 2.5

// Session duration (7 days in milliseconds)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null)
  const [isLocationTracking, setIsLocationTracking] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const rehydrateSession = () => {
      try {
        const storedSession = localStorage.getItem(SESSION_KEY)
        const storedUser = localStorage.getItem(USER_KEY)
        
        if (storedSession && storedUser) {
          const parsedSession: UserSession = JSON.parse(storedSession)
          const parsedUser: UserProfile = JSON.parse(storedUser)
          
          // Check if session is still valid
          if (parsedSession.expiresAt > Date.now()) {
            setSession(parsedSession)
            setUser(parsedUser)
            
            // Auto-start location tracking if verified
            if (parsedUser.isVerified) {
              const savedLocation = getSavedLocation()
              if (savedLocation) {
                setCurrentLocation(savedLocation)
              }
              // Start tracking for real-time updates
              startLocationTrackingInternal()
            }
          } else {
            // Session expired, clear it
            clearSession()
          }
        }
      } catch (error) {
        console.error("Error rehydrating session:", error)
        clearSession()
      } finally {
        setIsLoading(false)
      }
    }

    rehydrateSession()
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Internal location tracking function
  const startLocationTrackingInternal = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return
    }

    setIsLocationTracking(true)
    setLocationError(null)

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        }
        setCurrentLocation(newLocation)
        saveUserLocation(newLocation)
        setLocationError(null)
      },
      (error) => {
        let errorMessage = "Unable to get location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setLocationError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute cache
      }
    )

    setWatchId(id)
  }, [])

  // Clear session helper
  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem("terraloop_name")
    localStorage.removeItem("terraloop_phone")
    clearUserLocation()
    setSession(null)
    setUser(null)
  }, [])

  // Login action - stores phone temporarily before OTP verification
  const login = useCallback((phone: string, name: string) => {
    const pendingUser: UserProfile = {
      phone,
      name,
      role: null,
      isVerified: false,
    }
    setUser(pendingUser)
    // Store in legacy format for backward compatibility
    localStorage.setItem("terraloop_phone", phone)
    localStorage.setItem("terraloop_name", name)
  }, [])

  // Verify OTP action
  const verifyOTP = useCallback(async (otp: string): Promise<boolean> => {
    // In production, this would call an API to verify the OTP
    // For now, we'll simulate verification (accept any 6-digit OTP)
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return false
    }

    if (!user) return false

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update user to verified
    const verifiedUser: UserProfile = {
      ...user,
      isVerified: true,
      verifiedAt: Date.now(),
    }

    // Create session
    const newSession: UserSession = {
      userId: `user_${user.phone}_${Date.now()}`,
      phone: user.phone,
      name: user.name,
      role: user.role,
      isVerified: true,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION,
    }

    // Save to state and localStorage
    setUser(verifiedUser)
    setSession(newSession)
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
    localStorage.setItem(USER_KEY, JSON.stringify(verifiedUser))

    // Start location tracking immediately after verification
    startLocationTrackingInternal()

    return true
  }, [user, startLocationTrackingInternal])

  // Set user role
  const setRole = useCallback((role: "grocer" | "buyer") => {
    if (!user || !session) return

    const updatedUser = { ...user, role }
    const updatedSession = { ...session, role }

    setUser(updatedUser)
    setSession(updatedSession)
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession))
  }, [user, session])

  // Logout action
  const logout = useCallback(() => {
    // Stop location tracking
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsLocationTracking(false)
    setCurrentLocation(null)
    
    // Clear session
    clearSession()
  }, [watchId, clearSession])

  // Start location tracking (public method)
  const startLocationTracking = useCallback(() => {
    startLocationTrackingInternal()
  }, [startLocationTrackingInternal])

  // Stop location tracking
  const stopLocationTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsLocationTracking(false)
  }, [watchId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  const value: UserContextState = {
    user,
    session,
    isAuthenticated: !!session && session.expiresAt > Date.now(),
    isLoading,
    currentLocation,
    isLocationTracking,
    locationError,
    login,
    verifyOTP,
    setRole,
    logout,
    startLocationTracking,
    stopLocationTracking,
    GEOFENCE_RADIUS_KM,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

// Export the geofence radius constant for use elsewhere
export { GEOFENCE_RADIUS_KM }
