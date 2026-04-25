"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full border border-[#d4af37]/30 bg-card/50 backdrop-blur-sm"
      >
        <Sun className="h-5 w-5 text-[#d4af37]" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-10 w-10 rounded-full border border-[#d4af37]/30 bg-card/50 backdrop-blur-sm transition-all hover:border-[#d4af37] hover:bg-card"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-[#d4af37] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-[#d4af37] transition-transform hover:-rotate-12" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
