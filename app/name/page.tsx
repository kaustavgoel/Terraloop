"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Sparkles, Wand2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function NamePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)

  const handleContinue = async () => {
    if (name.trim().length >= 2) {
      setIsAnimating(true)
      localStorage.setItem("terraloop_name", name.trim())
      
      // Magical animation delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/dashboard")
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/login")}
        className="absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/30 bg-card/50 backdrop-blur-sm transition-all hover:border-[#d4af37] hover:bg-card"
      >
        <ArrowLeft className="h-5 w-5 text-[#d4af37]" />
      </button>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
        
        {/* Magical sparkles when animating */}
        {isAnimating && (
          <>
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-[#d4af37] animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className={`relative mx-auto max-w-md px-4 py-20 transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : ''}`}>
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4af37] bg-card shadow-lg">
            <User className="h-8 w-8 text-[#d4af37]" />
          </div>
          <h1 
            className="mb-2 text-3xl font-bold text-magical"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            What&apos;s Your Name?
          </h1>
          <p 
            className="text-muted-foreground"
            style={{ fontFamily: 'Lora, serif' }}
          >
            Let us know what to call you, wizard
          </p>
        </div>

        <Card className="card-magical mb-6">
          <CardContent className="p-6">
            <label 
              className="mb-2 block text-sm font-medium text-foreground"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Your Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-14 w-full rounded-lg border border-border bg-input px-4 pr-12 text-lg font-medium text-foreground placeholder:text-muted-foreground focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                style={{ fontFamily: 'Lora, serif' }}
              />
              <Wand2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#d4af37]/50" />
            </div>
          </CardContent>
        </Card>

        {/* Welcome message preview */}
        {name.trim().length >= 2 && (
          <div className="mb-6 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/5 p-4 text-center">
            <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
              Welcome to TerraLoop,
            </p>
            <p 
              className="text-xl font-bold text-magical"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {name.trim()}
            </p>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={name.trim().length < 2 || isAnimating}
          className={`group relative w-full overflow-hidden rounded-full border-2 py-4 text-lg font-semibold transition-all duration-300 ${
            name.trim().length >= 2 && !isAnimating
              ? 'border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#b8962f] text-background hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
              : 'border-border bg-secondary text-muted-foreground cursor-not-allowed'
          }`}
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isAnimating ? (
              <>
                <Sparkles className="h-5 w-5 animate-spin" />
                Casting Spell...
              </>
            ) : (
              <>
                Enter the Realm
                <Sparkles className="h-5 w-5" />
              </>
            )}
          </span>
        </button>

        {/* Step indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-2 w-8 rounded-full bg-[#d4af37]" />
          <div className="h-2 w-8 rounded-full bg-[#d4af37]" />
          <div className="h-2 w-8 rounded-full bg-[#d4af37]" />
        </div>
      </div>
    </div>
  )
}
