"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Leaf, Star } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function IntroPage() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500)
    const timer2 = setTimeout(() => setShowButton(true), 1500)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Magical background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl dark:bg-[#d4af37]/10" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl dark:bg-[#d4af37]/10" />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#8b4513]/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#1a472a]/5 blur-3xl" />
        
        {/* Floating magical particles - using deterministic positions to avoid hydration mismatch */}
        {[
          { left: 5, top: 10, delay: 0.1, duration: 3.2 },
          { left: 15, top: 80, delay: 1.5, duration: 4.1 },
          { left: 25, top: 30, delay: 2.3, duration: 3.8 },
          { left: 35, top: 60, delay: 0.7, duration: 4.5 },
          { left: 45, top: 15, delay: 1.9, duration: 3.5 },
          { left: 55, top: 85, delay: 2.8, duration: 4.2 },
          { left: 65, top: 45, delay: 0.4, duration: 3.9 },
          { left: 75, top: 70, delay: 1.2, duration: 4.8 },
          { left: 85, top: 25, delay: 2.1, duration: 3.3 },
          { left: 95, top: 55, delay: 0.9, duration: 4.0 },
          { left: 10, top: 40, delay: 1.7, duration: 3.6 },
          { left: 20, top: 90, delay: 2.5, duration: 4.3 },
          { left: 30, top: 20, delay: 0.3, duration: 3.7 },
          { left: 40, top: 75, delay: 1.4, duration: 4.6 },
          { left: 50, top: 5, delay: 2.0, duration: 3.4 },
          { left: 60, top: 95, delay: 0.6, duration: 4.4 },
          { left: 70, top: 35, delay: 1.8, duration: 3.1 },
          { left: 80, top: 65, delay: 2.6, duration: 4.7 },
          { left: 90, top: 50, delay: 0.2, duration: 3.0 },
          { left: 98, top: 8, delay: 1.1, duration: 4.9 },
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#d4af37]/60 animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#d4af37] bg-gradient-to-br from-card to-secondary shadow-2xl animate-glow">
              <Leaf className="h-16 w-16 text-[#d4af37]" />
            </div>
            <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-card shadow-lg">
              <Sparkles className="h-5 w-5 text-[#d4af37] animate-sparkle" />
            </div>
            <div className="absolute -left-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#d4af37] bg-card shadow-lg">
              <Star className="h-4 w-4 text-[#d4af37] fill-[#d4af37]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 
          className="mb-4 text-5xl font-bold tracking-tight text-magical md:text-7xl"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          TerraLoop
        </h1>
        
        {/* Tagline */}
        <p 
          className="mb-2 text-xl text-[#d4af37]/80 md:text-2xl"
          style={{ fontFamily: 'Lora, serif' }}
        >
          The Magical Marketplace
        </p>
        <p 
          className="mb-12 text-base text-muted-foreground md:text-lg"
          style={{ fontFamily: 'Lora, serif' }}
        >
          Where Freshness Meets Enchantment
        </p>

        {/* Decorative line */}
        <div className="mx-auto mb-12 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
          <Sparkles className="h-4 w-4 text-[#d4af37]/50" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
        </div>

        {/* Enter Button */}
        <div className={`transition-all duration-700 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => router.push('/language')}
            className="group relative overflow-hidden rounded-full border-2 border-[#d4af37] bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/5 px-12 py-4 text-lg font-semibold text-[#d4af37] transition-all duration-300 hover:from-[#d4af37] hover:to-[#b8962f] hover:text-background hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            <span className="relative z-10">Begin Your Journey</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </button>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p 
          className="text-xs text-muted-foreground/50"
          style={{ fontFamily: 'Lora, serif' }}
        >
          Powered by AI Magic
        </p>
      </div>
    </div>
  )
}
