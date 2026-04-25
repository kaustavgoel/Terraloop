import Link from "next/link"
import { Leaf, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategorySelection } from "@/components/category-selection"

export default function SelectCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">TerraLoop</h1>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Choose Fruit Category</h2>
          <p className="text-muted-foreground">
            Select between climacteric and non-climacteric fruits to browse our marketplace
          </p>
        </div>

        {/* Category Selection Cards */}
        <CategorySelection />

        {/* Educational Section */}
        <div className="mt-12 rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Why does this matter?</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Understanding whether a fruit is climacteric or non-climacteric helps you make 
              better purchasing decisions and reduces food waste.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="mb-1 font-medium text-amber-900">Climacteric Fruits</p>
                <p className="text-amber-700">
                  Can be bought unripe and will ripen at home. Store at room temperature 
                  until ripe, then refrigerate.
                </p>
              </div>
              <div className="rounded-lg bg-sky-50 p-4">
                <p className="mb-1 font-medium text-sky-900">Non-Climacteric Fruits</p>
                <p className="text-sky-700">
                  Must be purchased ripe as they won&apos;t improve after harvest. 
                  Refrigerate immediately for best freshness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
