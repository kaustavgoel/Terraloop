"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Globe, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { languages } from "@/lib/localization"

export default function LanguagePage() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  const handleContinue = () => {
    if (selectedLanguage) {
      localStorage.setItem("terraloop_language", selectedLanguage)
      router.push("/login")
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
        onClick={() => router.push("/")}
        className="absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/30 bg-card/50 backdrop-blur-sm transition-all hover:border-[#d4af37] hover:bg-card"
      >
        <ArrowLeft className="h-5 w-5 text-[#d4af37]" />
      </button>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-lg px-4 py-20">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4af37] bg-card shadow-lg">
            <Globe className="h-8 w-8 text-[#d4af37]" />
          </div>
          <h1 
            className="mb-2 text-3xl font-bold text-magical"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            भाषा चुनें
          </h1>
          <p className="text-lg text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
            Select Language
          </p>
          <p 
            className="mt-2 text-muted-foreground"
            style={{ fontFamily: 'Lora, serif' }}
          >
            Choose your preferred language
          </p>
        </div>

        {/* Language Grid */}
        <div className="mb-8 grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <Card
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`cursor-pointer transition-all duration-300 ${
                selectedLanguage === lang.code
                  ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'card-magical border-border hover:border-[#d4af37]/50'
              }`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p 
                    className="font-semibold text-foreground text-lg"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {lang.native}
                  </p>
                  <p className="text-xs text-muted-foreground">{lang.name}</p>
                </div>
                {selectedLanguage === lang.code && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d4af37]">
                    <Check className="h-4 w-4 text-background" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedLanguage}
          className={`group relative w-full overflow-hidden rounded-full border-2 py-4 text-lg font-semibold transition-all duration-300 ${
            selectedLanguage
              ? 'border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#b8962f] text-background hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
              : 'border-border bg-secondary text-muted-foreground cursor-not-allowed'
          }`}
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Continue / जारी रखें
            <Sparkles className="h-5 w-5" />
          </span>
        </button>

        {/* Step indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-2 w-8 rounded-full bg-[#d4af37]" />
          <div className="h-2 w-8 rounded-full bg-border" />
          <div className="h-2 w-8 rounded-full bg-border" />
        </div>
      </div>
    </div>
  )
}
