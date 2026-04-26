"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, MapPin, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { autoDetectLocation, getSavedLocation, type UserLocation } from "@/lib/location"
import { useUser } from "@/contexts/UserContext"

// Google Icon Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { signInWithGoogle, isAuthenticated, isLoading: isAuthLoading } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locationStatus, setLocationStatus] = useState<"detecting" | "success" | "error" | "idle">("idle")

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isAuthLoading, router])

  // Auto-detect location on mount (silently in background)
  useEffect(() => {
    const savedLocation = getSavedLocation()
    if (savedLocation) {
      setUserLocation(savedLocation)
      setLocationStatus("success")
      return
    }

    setLocationStatus("detecting")
    autoDetectLocation()
      .then((location) => {
        setUserLocation(location)
        setLocationStatus("success")
      })
      .catch(() => {
        setLocationStatus("error")
      })
  }, [])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google sign-in error:", error)
      setIsLoading(false)
    }
  }

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#d4af37]" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Location Status Indicator */}
      <div className="absolute left-4 bottom-4 z-50">
        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs backdrop-blur-sm transition-all ${
          locationStatus === "success" 
            ? "border border-green-500/30 bg-green-500/10 text-green-400"
            : locationStatus === "detecting"
            ? "border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]"
            : locationStatus === "error"
            ? "border border-red-500/30 bg-red-500/10 text-red-400"
            : "border border-border bg-card/50 text-muted-foreground"
        }`}>
          {locationStatus === "detecting" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Detecting location...</span>
            </>
          )}
          {locationStatus === "success" && (
            <>
              <CheckCircle2 className="h-3 w-3" />
              <span>Location detected</span>
            </>
          )}
          {locationStatus === "error" && (
            <>
              <MapPin className="h-3 w-3" />
              <span>Location unavailable</span>
            </>
          )}
        </div>
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
        {/* Logo and Title */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-[#d4af37]/20 to-[#b8962f]/20 shadow-lg">
            <Sparkles className="h-10 w-10 text-[#d4af37]" />
          </div>
          <h1 
            className="mb-2 text-4xl font-bold text-magical"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Terraloop
          </h1>
          <p 
            className="text-muted-foreground"
            style={{ fontFamily: 'Lora, serif' }}
          >
            Fresh produce, locally sourced
          </p>
        </div>

        {/* Login Card */}
        <Card className="card-magical w-full">
          <CardContent className="p-6">
            <h2 
              className="mb-6 text-center text-xl font-semibold text-foreground"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Sign in to continue
            </h2>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border-2 border-border bg-card py-4 text-lg font-semibold text-foreground transition-all duration-300 hover:border-[#d4af37] hover:bg-card/80 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <GoogleIcon className="h-6 w-6" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Info Text */}
            <p className="text-center text-sm text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg border border-border/50 bg-card/50 p-3 backdrop-blur-sm">
            <div className="mb-1 text-lg font-bold text-[#d4af37]">2.5km</div>
            <div className="text-xs text-muted-foreground">Local Range</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/50 p-3 backdrop-blur-sm">
            <div className="mb-1 text-lg font-bold text-[#d4af37]">Fresh</div>
            <div className="text-xs text-muted-foreground">Produce</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/50 p-3 backdrop-blur-sm">
            <div className="mb-1 text-lg font-bold text-[#d4af37]">Live</div>
            <div className="text-xs text-muted-foreground">Tracking</div>
          </div>
        </div>
      </div>
    </div>
  )
}
