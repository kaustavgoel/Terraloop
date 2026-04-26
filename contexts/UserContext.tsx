"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { getSavedLocation, saveUserLocation, clearUserLocation, type UserLocation } from "@/lib/location"
import type { User, Session } from "@supabase/supabase-js"

// User profile interface (extended from Supabase user)
export interface UserProfile {
  id: string
  email: string | null
  name: string
  avatar?: string
  role: "grocer" | "buyer" | null
  phone?: string
}

// Context state interface
interface UserContextState {
  // Auth state
  user: UserProfile | null
  supabaseUser: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Location state
  currentLocation: UserLocation | null
  isLocationTracking: boolean
  locationError: string | null
  
  // Auth actions
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => void
  setRole: (role: "grocer" | "buyer") => void
  
  // Location actions
  startLocationTracking: () => void
  stopLocationTracking: () => void
  
  // Geofencing config
  GEOFENCE_RADIUS_KM: number
}

// Default values
const defaultContext: UserContextState = {
  user: null,
  supabaseUser: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  currentLocation: null,
  isLocationTracking: false,
  locationError: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updateProfile: () => {},
  setRole: () => {},
  startLocationTracking: () => {},
  stopLocationTracking: () => {},
  GEOFENCE_RADIUS_KM: 2.5,
}

// Create context
const UserContext = createContext<UserContextState>(defaultContext)

// Geofence radius
const GEOFENCE_RADIUS_KM = 2.5

// Local storage keys for profile data
const PROFILE_KEY = "terraloop_profile"

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null)
  const [isLocationTracking, setIsLocationTracking] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  const supabase = createClient()

  // Convert Supabase user to UserProfile
  const createProfileFromUser = useCallback((supaUser: User): UserProfile => {
    // Try to get saved profile data
    const savedProfile = localStorage.getItem(PROFILE_KEY)
    const parsedProfile = savedProfile ? JSON.parse(savedProfile) : {}
    
    return {
      id: supaUser.id,
      email: supaUser.email ?? null,
      name: parsedProfile.name || supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
      avatar: supaUser.user_metadata?.avatar_url || supaUser.user_metadata?.picture,
      role: parsedProfile.role || null,
      phone: parsedProfile.phone,
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        console.log('[v0] Initializing auth state...')
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[v0] Error getting session:', error.message)
        }
        
        if (!mounted) return
        
        if (initialSession?.user) {
          console.log('[v0] Session found for user:', initialSession.user.email)
          setSession(initialSession)
          setSupabaseUser(initialSession.user)
          setUser(createProfileFromUser(initialSession.user))
          
          // Load saved location
          const savedLocation = getSavedLocation()
          if (savedLocation) {
            console.log('[v0] Restored saved location')
            setCurrentLocation(savedLocation)
          }
        } else {
          console.log('[v0] No active session found')
        }
      } catch (error) {
        console.error('[v0] Error initializing auth:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('[v0] Auth state changed:', event)
        
        if (!mounted) return
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          console.log('[v0] User signed in:', newSession.user.email)
          setSession(newSession)
          setSupabaseUser(newSession.user)
          setUser(createProfileFromUser(newSession.user))
          
          // Load saved location after sign in
          const savedLocation = getSavedLocation()
          if (savedLocation) {
            setCurrentLocation(savedLocation)
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('[v0] User signed out')
          setSession(null)
          setSupabaseUser(null)
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
          console.log('[v0] Token refreshed for user:', newSession.user.email)
          setSession(newSession)
          setSupabaseUser(newSession.user)
          setUser(createProfileFromUser(newSession.user))
        } else if (newSession?.user) {
          // Handle other events with valid session
          setSession(newSession)
          setSupabaseUser(newSession.user)
          setUser(createProfileFromUser(newSession.user))
        } else if (!newSession) {
          setSession(null)
          setSupabaseUser(null)
          setUser(null)
        }
        
        setIsLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth, createProfileFromUser])

  // Location tracking
  const startLocationTrackingInternal = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported")
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
        maximumAge: 60000,
      }
    )

    setWatchId(id)
  }, [])

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
        `${window.location.origin}/auth/callback`
      
      console.log('[v0] Initiating Google sign-in with redirect URL:', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('[v0] Google sign-in error:', error.message)
        throw error
      }

      console.log('[v0] OAuth redirect initiated:', data?.url ? 'URL generated' : 'No URL')
    } catch (err) {
      console.error('[v0] Unexpected error during Google sign-in:', err)
      throw err
    }
  }, [supabase.auth])

  // Sign out
  const signOut = useCallback(async () => {
    // Stop location tracking
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsLocationTracking(false)
    setCurrentLocation(null)
    
    // Clear local data
    localStorage.removeItem(PROFILE_KEY)
    localStorage.removeItem("terraloop_name")
    localStorage.removeItem("terraloop_phone")
    clearUserLocation()
    
    // Sign out from Supabase
    await supabase.auth.signOut()
    
    setUser(null)
    setSupabaseUser(null)
    setSession(null)
  }, [supabase.auth, watchId])

  // Update profile
  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedUser))
    
    // Also update legacy storage for backward compatibility
    if (data.name) {
      localStorage.setItem("terraloop_name", data.name)
    }
    if (data.phone) {
      localStorage.setItem("terraloop_phone", data.phone)
    }
  }, [user])

  // Set role
  const setRole = useCallback((role: "grocer" | "buyer") => {
    if (!user) return
    updateProfile({ role })
  }, [user, updateProfile])

  // Start location tracking
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  const value: UserContextState = {
    user,
    supabaseUser,
    session,
    isAuthenticated: !!session,
    isLoading,
    currentLocation,
    isLocationTracking,
    locationError,
    signInWithGoogle,
    signOut,
    updateProfile,
    setRole,
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

// Custom hook
export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export { GEOFENCE_RADIUS_KM }
