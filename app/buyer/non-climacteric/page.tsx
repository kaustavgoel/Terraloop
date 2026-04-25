"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Snowflake, Sparkles, ShoppingCart, Star, Clock, Phone, MapPin, User, CheckCircle2, X, Utensils, Droplets, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { fruits } from "@/lib/fruit-data"
import { getListingsByCategory, purchaseListing, type GrocerListing } from "@/lib/store"
import { type Language, getTranslation } from "@/lib/localization"

const nonClimactericFruits = fruits.filter(f => f.category === "non-climacteric")

export default function NonClimactericFruitsPage() {
  const [grocerListings, setGrocerListings] = useState<GrocerListing[]>([])
  const [purchasedItem, setPurchasedItem] = useState<GrocerListing | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [t, setT] = useState<ReturnType<typeof getTranslation> | null>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem("terraloop_language") as Language || "en"
    setT(getTranslation(savedLang))
    
    // Load grocer listings
    const listings = getListingsByCategory("non-climacteric")
    setGrocerListings(listings)
  }, [])

  const handlePurchase = (listing: GrocerListing) => {
    const purchased = purchaseListing(listing.id)
    if (purchased) {
      setPurchasedItem(purchased)
      setShowModal(true)
      // Remove from local state
      setGrocerListings(prev => prev.filter(l => l.id !== listing.id))
    }
  }

  const getUseIcon = (use: string) => {
    const lower = use.toLowerCase()
    if (lower.includes("face") || lower.includes("hair")) return <Droplets className="h-3 w-3" />
    if (lower.includes("compost") || lower.includes("fertilizer")) return <Leaf className="h-3 w-3" />
    return <Utensils className="h-3 w-3" />
  }

  if (!t) return null

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Purchase Success Modal */}
      {showModal && purchasedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="mx-4 max-w-md card-magical bg-card">
            <CardContent className="p-6">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-500 bg-green-500/20">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                  {t.purchaseSuccess}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  {purchasedItem.fruitName} purchased successfully!
                </p>
              </div>

              <div className="space-y-4 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 p-4">
                <h3 className="font-semibold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                  {t.grocerDetails}
                </h3>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <User className="h-5 w-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.grocerName}</p>
                    <p className="font-medium text-foreground">{purchasedItem.grocerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <Phone className="h-5 w-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.grocerPhone}</p>
                    <p className="font-medium text-foreground">+91 {purchasedItem.grocerPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <MapPin className="h-5 w-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.pickupLocation}</p>
                    <p className="font-medium text-foreground">{purchasedItem.grocerLocation}</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowModal(false)}
                className="mt-6 w-full bg-[#d4af37] text-[#1a1a2e] hover:bg-[#c4a030]"
              >
                {t.continue}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Magical background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/buyer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center justify-center gap-3 rounded-full border border-sky-500/30 bg-sky-500/10 px-6 py-2">
            <Snowflake className="h-5 w-5 text-sky-400" />
            <span className="text-sm font-medium text-sky-300">{t.nonClimactericDesc}</span>
          </div>
          
          <h1 className="mb-2 text-3xl font-bold text-magical md:text-4xl" style={{ fontFamily: 'Cinzel, serif' }}>
            {t.nonClimactericFruits}
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
            {t.selectProduce}
          </p>
        </div>

        {/* Grocer Listings Section */}
        {grocerListings.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
              <Sparkles className="h-5 w-5" />
              Fresh from Grocers
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {grocerListings.map((listing) => (
                <Card key={listing.id} className="card-magical group h-full overflow-hidden bg-card transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Image container */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sky-900/20 to-indigo-900/20">
                      {listing.images[0] && (
                        <Image
                          src={listing.images[0]}
                          alt={listing.fruitName}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      
                      {/* Fresh badge */}
                      <div className="absolute left-3 top-3">
                        <Badge className="border-green-500/50 bg-green-500/90 text-white">
                          Fresh Listing
                        </Badge>
                      </div>
                      
                      {/* Quick stats on hover */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                          <Star className="h-3 w-3 fill-[#d4af37] text-[#d4af37]" />
                          {listing.freshness}/10
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                          <Clock className="h-3 w-3" />
                          {listing.shelfLife}
                        </div>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
                          {listing.fruitName}
                        </h3>
                        <span className="text-lg font-bold text-[#d4af37]">
                          Rs. {listing.price}
                        </span>
                      </div>

                      {/* Grocer info */}
                      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{listing.grocerName}</span>
                      </div>
                      
                      {/* Freshness bar */}
                      <div className="mb-3">
                        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{t.freshness}</span>
                          <span>{listing.freshness}/10</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div 
                            className={`h-full rounded-full ${
                              listing.freshness >= 8 ? "bg-green-500" :
                              listing.freshness >= 5 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${listing.freshness * 10}%` }}
                          />
                        </div>
                      </div>

                      {/* Recommended Uses */}
                      <div className="mb-3">
                        <p className="mb-1 text-xs text-muted-foreground">{t.recommendedUses}</p>
                        <div className="flex flex-wrap gap-1">
                          {listing.recommendedUses.slice(0, 3).map((use, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                              {getUseIcon(use)}
                              <span className="ml-1">{use}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Buy Now Button */}
                      <Button 
                        onClick={() => handlePurchase(listing)}
                        className="w-full bg-[#d4af37] text-[#1a1a2e] hover:bg-[#c4a030]"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {t.buyNow}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Default Fruits Grid */}
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
          <Snowflake className="h-5 w-5 text-sky-400" />
          {t.browseCollection}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {nonClimactericFruits.map((fruit, index) => (
            <Link 
              key={fruit.id} 
              href={`/marketplace?category=non-climacteric&fruit=${fruit.id}`}
              className="group block"
            >
              <Card className="card-magical h-full overflow-hidden bg-card transition-all duration-300">
                <CardContent className="p-0">
                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sky-900/20 to-indigo-900/20">
                    <Image
                      src={fruit.image}
                      alt={fruit.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    
                    {/* Rank badge */}
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#d4af37] bg-[#1a1a2e]/90 text-xs font-bold text-[#d4af37]">
                      #{index + 1}
                    </div>
                    
                    {/* Quick stats on hover */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                        <Star className="h-3 w-3 fill-[#d4af37] text-[#d4af37]" />
                        {fruit.freshness}/10
                      </div>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
                        {fruit.name}
                      </h3>
                      <span className="text-lg font-bold text-[#d4af37]">
                        Rs. {fruit.price.toFixed(0)}
                      </span>
                    </div>
                    
                    {/* Freshness bar */}
                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t.freshness}</span>
                        <span>{fruit.freshness}/10</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div 
                          className="xp-bar h-full rounded-full"
                          style={{ width: `${fruit.freshness * 10}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-2 text-sm font-medium text-[#d4af37] transition-colors group-hover:bg-[#d4af37]/20">
                      <ShoppingCart className="h-4 w-4" />
                      {t.viewMarketplace}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Tip section */}
        <div className="mt-12 rounded-xl border border-sky-500/20 bg-sky-500/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/20">
              <Sparkles className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-sky-300" style={{ fontFamily: 'Cinzel, serif' }}>
                Pro Tip: The Preservation Charm
              </h3>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
                Non-climacteric fruits should be refrigerated immediately after purchase. 
                They are harvested at peak ripeness and will not improve - enjoy them fresh!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
