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
        
        {/* Floating magical particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#d4af37]/60 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
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
