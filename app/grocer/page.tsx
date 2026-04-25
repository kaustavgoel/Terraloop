"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, Store, Sparkles, Camera, X, Check, Loader2, Trophy, Star, ImageIcon, RotateCcw, Leaf, Droplets, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { addListing, getCurrentUser, getRandomLocation, getGrocerListings, type GrocerListing } from "@/lib/store"
import { useLocalization, type Language } from "@/lib/localization"

interface AnalysisResult {
  rating: number
  consumeStatus: string
  shelfLife: string
  verdict: string
  alternativeUses: string[]
  fruitType: string
  category?: "climacteric" | "non-climacteric"
  recommendedUses: string[]
  qualityGrade: string
  priceEstimate: number
}

// Climacteric fruits list for categorization
const CLIMACTERIC_FRUITS = [
  "apple", "banana", "mango", "avocado", "peach", "papaya", "pear", "kiwi",
  "apricot", "plum", "fig", "guava", "passion fruit", "persimmon", "tomato"
]

export default function GrocerPage() {
  const [uploadedFruits, setUploadedFruits] = useState<GrocerListing[]>([])
  const [currentImages, setCurrentImages] = useState<(string | null)[]>([null, null, null, null])
  const [isDragging, setIsDragging] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [t, setT] = useState<ReturnType<typeof useLocalization>["t"] | null>(null)
  const [adjustedPrice, setAdjustedPrice] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null])

  const ANGLE_LABELS = t ? [t.frontView, t.sideView, t.topView, t.closeUp] : ["Front View", "Side View", "Top View", "Close-up"]

  useEffect(() => {
    const savedLang = localStorage.getItem("terraloop_language") as Language || "en"
    import("@/lib/localization").then(mod => {
      setT(mod.getTranslation(savedLang))
    })
    
    // Load existing listings for this grocer
    const user = getCurrentUser()
    if (user) {
      const listings = getGrocerListings(user.phone)
      setUploadedFruits(listings)
      setXpEarned(listings.length * 50)
    }
  }, [])

  const uploadedCount = currentImages.filter(img => img !== null).length

  const handleFile = useCallback((file: File, index: number) => {
    if (!file.type.startsWith("image/")) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setCurrentImages(prev => {
        const newImages = [...prev]
        newImages[index] = e.target?.result as string
        return newImages
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    setIsDragging(null)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file, index)
  }, [handleFile])

  const clearImage = (index: number) => {
    setCurrentImages(prev => {
      const newImages = [...prev]
      newImages[index] = null
      return newImages
    })
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = ""
    }
    setAnalysisResult(null)
  }

  const clearAllImages = () => {
    setCurrentImages([null, null, null, null])
    setAnalysisResult(null)
    fileInputRefs.current.forEach(ref => {
      if (ref) ref.value = ""
    })
  }

  const analyzeImages = async () => {
    const validImages = currentImages.filter(img => img !== null)
    if (validImages.length < 4) return

    setIsAnalyzing(true)
    setAnalysisStep(1)

    try {
      // Use the first image for primary analysis
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: validImages[0] })
      })

      setAnalysisStep(2)

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setAnalysisStep(3)

      // Parse the AI response
      let parsed: AnalysisResult
      try {
        const cleanedText = data.analysis.replace(/```json\n?|\n?```/g, "").trim()
        parsed = JSON.parse(cleanedText)
      } catch {
        throw new Error("Failed to parse analysis")
      }

      // Determine category based on fruit type
      const fruitLower = parsed.fruitType.toLowerCase()
      const isClimacteric = CLIMACTERIC_FRUITS.some(f => fruitLower.includes(f))
      parsed.category = isClimacteric ? "climacteric" : "non-climacteric"

      setAnalysisResult(parsed)
      setAdjustedPrice(parsed.priceEstimate || 100)
      setQuantity(1)
      setAnalysisStep(4)
    } catch (error) {
      console.error("Analysis error:", error)
      setAnalysisResult(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const confirmListing = () => {
    if (!analysisResult) return

    const user = getCurrentUser()
    if (!user) {
      alert("Please login first")
      return
    }

    const newListing = addListing({
      fruitName: analysisResult.fruitType,
      category: analysisResult.category || "climacteric",
      freshness: analysisResult.rating,
      shelfLife: analysisResult.shelfLife,
      verdict: analysisResult.verdict,
      images: currentImages.filter(img => img !== null) as string[],
      recommendedUses: analysisResult.recommendedUses || [],
      grocerName: user.name,
      grocerPhone: user.phone,
      grocerLocation: getRandomLocation(),
      price: adjustedPrice,
      quantity: quantity,
    })

    setUploadedFruits(prev => [...prev, newListing])
    setXpEarned(prev => prev + 50)
    clearAllImages()
    setAnalysisResult(null)
  }

  const getFreshnessColor = (rating: number) => {
    if (rating >= 8) return "text-green-400"
    if (rating >= 5) return "text-yellow-400"
    return "text-red-400"
  }

  const getFreshnessBarColor = (rating: number) => {
    if (rating >= 8) return "bg-green-500"
    if (rating >= 5) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getQualityBadgeColor = (grade: string) => {
    switch (grade?.toLowerCase()) {
      case "excellent": return "border-green-500/50 bg-green-500/20 text-green-400"
      case "good": return "border-blue-500/50 bg-blue-500/20 text-blue-400"
      case "fair": return "border-yellow-500/50 bg-yellow-500/20 text-yellow-400"
      default: return "border-red-500/50 bg-red-500/20 text-red-400"
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

      {/* Magical background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#5d1a1a]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-[#5d1a1a] to-[#7a2d2d] shadow-lg">
              <Store className="h-8 w-8 text-[#d4af37]" />
            </div>
          </div>
          
          <h1 className="mb-2 text-3xl font-bold text-magical md:text-4xl" style={{ fontFamily: 'Cinzel, serif' }}>
            {t.grocerGuild}
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
            {t.uploadDesc}
          </p>
          
          {/* XP indicator */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-secondary/50 px-4 py-2 text-sm">
            <Trophy className="h-4 w-4 text-[#d4af37]" />
            <span className="text-[#d4af37] font-semibold">{xpEarned} {t.xpEarned}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Upload Section */}
          <div className="lg:col-span-3">
            <Card className="card-magical overflow-hidden bg-card">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-[#5d1a1a]/30 to-[#7a2d2d]/30">
                <CardTitle className="flex items-center gap-2 text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                  <Camera className="h-5 w-5" />
                  {t.uploadPhotos}
                </CardTitle>
                <CardDescription style={{ fontFamily: 'Lora, serif' }}>
                  {t.uploadDesc}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* 4 Image Upload Grid */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  {ANGLE_LABELS.map((label, index) => (
                    <div key={index} className="relative">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
                      {!currentImages[index] ? (
                        <div
                          onDrop={(e) => handleDrop(e, index)}
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(index) }}
                          onDragLeave={(e) => { e.preventDefault(); setIsDragging(null) }}
                          onClick={() => fileInputRefs.current[index]?.click()}
                          className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                            isDragging === index
                              ? "border-[#d4af37] bg-[#d4af37]/10"
                              : "border-border hover:border-[#d4af37]/50 hover:bg-secondary/30"
                          }`}
                        >
                          <Upload className={`mb-2 h-6 w-6 ${isDragging === index ? "text-[#d4af37]" : "text-muted-foreground/40"}`} />
                          <p className="text-xs text-muted-foreground text-center px-2">Click or drag</p>
                        </div>
                      ) : (
                        <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-green-500/50">
                          <Image
                            src={currentImages[index]!}
                            alt={label}
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute right-1 top-1 h-6 w-6"
                            onClick={() => clearImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-1 left-1">
                            <Badge className="bg-green-500/90 text-xs">
                              <Check className="mr-1 h-3 w-3" />
                              Done
                            </Badge>
                          </div>
                        </div>
                      )}
                      <input
                        ref={(el) => { fileInputRefs.current[index] = el }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], index)}
                        className="hidden"
                      />
                    </div>
                  ))}
                </div>

                {/* Progress indicator */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Photos uploaded</span>
                    <span className="text-[#d4af37] font-semibold">{uploadedCount}/4</span>
                  </div>
                  <Progress value={(uploadedCount / 4) * 100} className="h-2" />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {uploadedCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllImages}
                      className="border-border text-muted-foreground hover:bg-secondary"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  )}
                  <Button
                    onClick={analyzeImages}
                    disabled={uploadedCount < 4 || isAnalyzing}
                    className="flex-1 bg-[#d4af37] py-6 text-[#1a1a2e] hover:bg-[#c4a030]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {analysisStep === 1 && "Scanning images..."}
                        {analysisStep === 2 && "Detecting fruit type..."}
                        {analysisStep === 3 && "Analyzing freshness..."}
                        {analysisStep === 4 && "Finalizing..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        {t.analyzeAI}
                      </>
                    )}
                  </Button>
                </div>

                {/* Analysis Result */}
                {analysisResult && (
                  <div className="mt-6 rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-transparent p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                      <Sparkles className="h-5 w-5" />
                      {t.detectionResults}
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Detected Fruit */}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t.detectedFruit}</span>
                        <span className="text-xl font-bold text-foreground">{analysisResult.fruitType}</span>
                      </div>

                      {/* Category */}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t.category}</span>
                        <Badge 
                          variant="outline" 
                          className={analysisResult.category === "climacteric" 
                            ? "border-amber-500/50 bg-amber-500/20 text-amber-400" 
                            : "border-sky-500/50 bg-sky-500/20 text-sky-400"
                          }
                        >
                          {analysisResult.category}
                        </Badge>
                      </div>

                      {/* Quality Grade */}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Quality Grade</span>
                        <Badge variant="outline" className={getQualityBadgeColor(analysisResult.qualityGrade)}>
                          {analysisResult.qualityGrade}
                        </Badge>
                      </div>

                      {/* Freshness Score */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-muted-foreground">{t.freshnessScore}</span>
                          <span className={`text-2xl font-bold ${getFreshnessColor(analysisResult.rating)}`}>
                            {analysisResult.rating}/10
                          </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-secondary">
                          <div 
                            className={`h-full transition-all ${getFreshnessBarColor(analysisResult.rating)}`}
                            style={{ width: `${analysisResult.rating * 10}%` }}
                          />
                        </div>
                      </div>

                      {/* Shelf Life */}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t.shelfLife}</span>
                        <span className="font-semibold text-foreground">{analysisResult.shelfLife}</span>
                      </div>

                      {/* Price Adjustment with Slider */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{t.price}</span>
                          <span className="text-lg font-bold text-[#d4af37]">Rs. {adjustedPrice}/kg</span>
                        </div>
                        <div className="space-y-2">
                          <Slider
                            value={[adjustedPrice]}
                            min={Math.max(0, (analysisResult.priceEstimate || 100) - 45)}
                            max={(analysisResult.priceEstimate || 100) + 45}
                            step={5}
                            onValueChange={(value) => setAdjustedPrice(value[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Rs. {Math.max(0, (analysisResult.priceEstimate || 100) - 45)}</span>
                            <span className="text-[#d4af37]">Suggested: Rs. {analysisResult.priceEstimate}</span>
                            <span>Rs. {(analysisResult.priceEstimate || 100) + 45}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Available */}
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Quantity Available (kg)</Label>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-[#d4af37]/30"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 text-center border-[#d4af37]/30"
                            min={1}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-[#d4af37]/30"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            +
                          </Button>
                          <span className="text-sm text-muted-foreground">kg</span>
                        </div>
                      </div>

                      {/* Verdict */}
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
                          {analysisResult.verdict}
                        </p>
                      </div>

                      {/* Recommended Uses */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">{t.recommendedUses}</p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.recommendedUses?.map((use, i) => (
                            <Badge key={i} variant="outline" className="border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                              {getUseIcon(use)}
                              <span className="ml-1">{use}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Confirm Button */}
                      <Button
                        onClick={confirmListing}
                        className="w-full bg-green-600 py-6 text-white hover:bg-green-700"
                      >
                        <Check className="mr-2 h-5 w-5" />
                        {t.confirmListing} (+50 XP)
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Listed Produce */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
              <Store className="h-5 w-5 text-[#d4af37]" />
              {t.yourListings}
            </h2>
            
            {uploadedFruits.length === 0 ? (
              <Card className="card-magical bg-card">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary/30">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
                    {t.noListings}
                  </h3>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
                    Upload 4 photos to start earning XP!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {uploadedFruits.filter(f => !f.sold).map((fruit) => (
                  <Card key={fruit.id} className="card-magical overflow-hidden bg-card">
                    <CardContent className="p-4">
                      {/* Image grid preview */}
                      <div className="mb-3 grid grid-cols-4 gap-1">
                        {fruit.images.slice(0, 4).map((img, i) => (
                          <div key={i} className="relative aspect-square overflow-hidden rounded">
                            <Image
                              src={img}
                              alt={`${fruit.fruitName} view ${i + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{fruit.fruitName}</h3>
                            <Badge 
                              variant="outline" 
                              className="border-green-500/50 bg-green-500/20 text-green-400"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Live
                            </Badge>
                          </div>
                          <div className="mb-2 flex items-center gap-3 text-sm text-muted-foreground">
                            <span className={getFreshnessColor(fruit.freshness)}>
                              {t.freshness}: {fruit.freshness}/10
                            </span>
                            <span>Rs. {fruit.price}/kg</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={fruit.category === "climacteric" 
                              ? "border-amber-500/50 bg-amber-500/20 text-amber-400" 
                              : "border-sky-500/50 bg-sky-500/20 text-sky-400"
                            }
                          >
                            {fruit.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#d4af37] text-[#d4af37]" />
                          <span className="text-sm font-medium text-[#d4af37]">+50 XP</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
