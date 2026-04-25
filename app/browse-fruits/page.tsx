"use client"

import Link from "next/link"
import Image from "next/image"
import { Leaf, ArrowLeft, Sun, Snowflake, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { fruits } from "@/lib/fruit-data"

const climactericFruits = fruits.filter(f => f.category === "climacteric")
const nonClimactericFruits = fruits.filter(f => f.category === "non-climacteric")

export default function BrowseFruitsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">TerraLoop</h1>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-foreground">Browse Our Fruits</h2>
          <p className="text-muted-foreground">
            Explore our selection of climacteric and non-climacteric fruits
          </p>
        </div>

        {/* Climacteric Fruits Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Sun className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Climacteric Fruits</h3>
                <p className="text-sm text-muted-foreground">Continue ripening after harvest</p>
              </div>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/marketplace?category=climacteric">
                View in Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {climactericFruits.map((fruit) => (
              <Link 
                key={fruit.id} 
                href={`/marketplace?category=climacteric`}
                className="group"
              >
                <Card className="overflow-hidden border-amber-100 transition-all duration-300 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative aspect-square overflow-hidden bg-amber-50">
                    <Image
                      src={fruit.image}
                      alt={fruit.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <CardContent className="p-3 text-center">
                    <h4 className="font-medium text-foreground">{fruit.name}</h4>
                    <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      Climacteric
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <Button variant="outline" asChild className="mt-4 w-full sm:hidden">
            <Link href="/marketplace?category=climacteric">
              View All Climacteric Fruits
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        {/* Non-Climacteric Fruits Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                <Snowflake className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Non-Climacteric Fruits</h3>
                <p className="text-sm text-muted-foreground">Best when picked ripe</p>
              </div>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/marketplace?category=non-climacteric">
                View in Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {nonClimactericFruits.map((fruit) => (
              <Link 
                key={fruit.id} 
                href={`/marketplace?category=non-climacteric`}
                className="group"
              >
                <Card className="overflow-hidden border-sky-100 transition-all duration-300 hover:border-sky-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative aspect-square overflow-hidden bg-sky-50">
                    <Image
                      src={fruit.image}
                      alt={fruit.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <CardContent className="p-3 text-center">
                    <h4 className="font-medium text-foreground">{fruit.name}</h4>
                    <span className="mt-1 inline-block rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">
                      Non-Climacteric
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <Button variant="outline" asChild className="mt-4 w-full sm:hidden">
            <Link href="/marketplace?category=non-climacteric">
              View All Non-Climacteric Fruits
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        {/* CTA Section */}
        <div className="rounded-xl border bg-gradient-to-r from-emerald-50 to-teal-50 p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">Ready to shop?</h3>
          <p className="mb-4 text-muted-foreground">
            Head to the marketplace to see pricing, freshness ratings, and more details
          </p>
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/select-category">
              Go to Marketplace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
