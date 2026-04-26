"use client"

import { Card, CardContent } from "@/components/ui/card"

// Skeleton for individual listing card
export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 bg-card">
      <CardContent className="p-0">
        {/* Image skeleton */}
        <div className="relative h-48 w-full animate-pulse bg-secondary/50" />
        
        <div className="p-4">
          {/* Title skeleton */}
          <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-secondary/50" />
          
          {/* Category badge skeleton */}
          <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-secondary/50" />
          
          {/* Description skeleton */}
          <div className="mb-3 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-secondary/50" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-secondary/50" />
          </div>
          
          {/* Freshness skeleton */}
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded-full bg-secondary/50" />
            <div className="h-4 w-32 animate-pulse rounded bg-secondary/50" />
          </div>
          
          {/* Price skeleton */}
          <div className="mb-3 flex items-center justify-between">
            <div className="h-6 w-20 animate-pulse rounded bg-secondary/50" />
            <div className="h-4 w-16 animate-pulse rounded bg-secondary/50" />
          </div>
          
          {/* Seller info skeleton */}
          <div className="mt-3 space-y-2 rounded-lg border border-border/20 bg-secondary/20 p-2.5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-secondary/50" />
              <div className="h-3 w-24 animate-pulse rounded bg-secondary/50" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-secondary/50" />
              <div className="h-3 w-28 animate-pulse rounded bg-secondary/50" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-secondary/50" />
              <div className="h-3 w-32 animate-pulse rounded bg-secondary/50" />
            </div>
          </div>
          
          {/* Button skeleton */}
          <div className="mt-4 h-10 w-full animate-pulse rounded-full bg-secondary/50" />
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for the category tabs
export function CategoryTabsSkeleton() {
  return (
    <div className="mb-6">
      <div className="flex w-full max-w-md gap-2">
        <div className="h-10 flex-1 animate-pulse rounded-md bg-secondary/50" />
        <div className="h-10 flex-1 animate-pulse rounded-md bg-secondary/50" />
        <div className="h-10 flex-1 animate-pulse rounded-md bg-secondary/50" />
      </div>
    </div>
  )
}

// Skeleton for location status banner
export function LocationBannerSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-border/30 bg-secondary/20 p-4">
      <div className="h-5 w-5 animate-pulse rounded-full bg-secondary/50" />
      <div className="flex-1">
        <div className="mb-1 h-4 w-48 animate-pulse rounded bg-secondary/50" />
        <div className="h-3 w-32 animate-pulse rounded bg-secondary/50" />
      </div>
    </div>
  )
}

// Full marketplace skeleton
export function MarketplaceSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="border-b border-border/50 bg-card/50 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-secondary/50" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-24 animate-pulse rounded bg-secondary/50" />
            <div className="h-10 w-10 animate-pulse rounded-full bg-secondary/50" />
          </div>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Location banner skeleton */}
        <LocationBannerSkeleton />
        
        {/* Category tabs skeleton */}
        <CategoryTabsSkeleton />
        
        {/* Grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Skeleton for when fetching more listings
export function LoadingMoreSkeleton() {
  return (
    <div className="col-span-full flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent" />
        <span className="text-muted-foreground">Finding nearby sellers...</span>
      </div>
    </div>
  )
}

// Empty state when no listings found
export function NoListingsFound({ radius }: { radius: number }) {
  return (
    <div className="col-span-full py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border bg-secondary/20">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 
        className="mb-2 text-xl font-semibold text-foreground"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        No Sellers Nearby
      </h3>
      <p className="mb-4 text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
        We couldn&apos;t find any sellers within {radius}km of your location.
      </p>
      <p className="text-sm text-muted-foreground">
        New sellers are joining every day. Check back soon!
      </p>
    </div>
  )
}
