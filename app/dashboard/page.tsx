"use client"

import Link from "next/link"
import { ShoppingCart, Store, Sparkles, Star, Trophy, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Magical background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b4513]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-12">
        {/* Header with magical branding */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] shadow-lg">
                <Sparkles className="h-8 w-8 text-[#d4af37] animate-sparkle" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#d4af37] bg-[#1a1a2e] text-xs font-bold text-[#d4af37]">
                <Star className="h-3 w-3 fill-[#d4af37]" />
              </div>
            </div>
          </div>
          
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-magical md:text-5xl" style={{ fontFamily: 'Cinzel, serif' }}>
            TerraLoop
          </h1>
          <p className="mb-4 text-lg text-[#d4af37]/80" style={{ fontFamily: 'Lora, serif' }}>
            The Magical Marketplace of Fresh Enchantments
          </p>
          
          {/* XP Bar */}
          <div className="mx-auto max-w-xs">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3 text-[#d4af37]" />
                Level 1 Apprentice
              </span>
              <span>0 / 100 XP</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="xp-bar h-full w-0 rounded-full" />
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-semibold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
            Choose Your Path
          </h2>
          <p className="text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
            Are you seeking magical produce or offering your harvest?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Buyer Card */}
          <Link href="/buyer" className="group block">
            <Card className="card-magical h-full overflow-hidden bg-card transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-[#1a472a] to-[#2d5a3f] px-6 py-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#1a1a2e]/80 shadow-lg transition-transform group-hover:scale-110">
                      <ShoppingCart className="h-10 w-10 text-[#d4af37]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                      Buyer
                    </h3>
                    <p className="mt-1 text-sm text-[#d4af37]/70" style={{ fontFamily: 'Lora, serif' }}>
                      Seeker of Fresh Enchantments
                    </p>
                  </div>
                  
                  {/* Card Body */}
                  <div className="bg-gradient-to-b from-card to-secondary/20 px-6 py-6">
                    <ul className="space-y-3 text-sm text-foreground" style={{ fontFamily: 'Lora, serif' }}>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#d4af37]" />
                        Browse climacteric and non-climacteric fruits
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#d4af37]" />
                        View freshness ratings and shelf life
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#d4af37]" />
                        Purchase directly from trusted grocers
                      </li>
                    </ul>
                    
                    <div className="mt-6 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-3 text-center">
                      <span className="text-sm font-medium text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                        Enter the Marketplace
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Grocer Card */}
          <Link href="/grocer" className="group block">
            <Card className="card-magical h-full overflow-hidden bg-card transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-[#5d1a1a] to-[#7a2d2d] px-6 py-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#1a1a2e]/80 shadow-lg transition-transform group-hover:scale-110">
                      <Store className="h-10 w-10 text-[#d4af37]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                      Grocer
                    </h3>
                    <p className="mt-1 text-sm text-[#d4af37]/70" style={{ fontFamily: 'Lora, serif' }}>
                      Purveyor of Magical Produce
                    </p>
                  </div>
                  
                  {/* Card Body */}
                  <div className="bg-gradient-to-b from-card to-secondary/20 px-6 py-6">
                    <ul className="space-y-3 text-sm text-foreground" style={{ fontFamily: 'Lora, serif' }}>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#d4af37]" />
                        Upload photos of your fresh produce
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#d4af37]" />
                        AI-powered freshness verification
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#d4af37]" />
                        Reach buyers seeking quality fruits
                      </li>
                    </ul>
                    
                    <div className="mt-6 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-3 text-center">
                      <span className="text-sm font-medium text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                        List Your Produce
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer tagline */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
            &quot;Where every fruit tells a story of freshness&quot;
          </p>
        </div>
      </div>
    </div>
  )
}
