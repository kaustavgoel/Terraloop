"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { MarketplaceContent } from "@/components/marketplace-content"

function MarketplaceLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  )
}

function MarketplaceWithParams() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") as "climacteric" | "non-climacteric" | null
  
  return <MarketplaceContent initialCategory={category} />
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceLoader />}>
      <MarketplaceWithParams />
    </Suspense>
  )
}
