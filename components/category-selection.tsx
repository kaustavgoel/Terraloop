"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sun, Snowflake } from "lucide-react"
import Link from "next/link"

interface CategoryCardProps {
  title: string
  description: string
  icon: React.ReactNode
  examples: string[]
  href: string
  gradient: string
  iconBg: string
}

function CategoryCard({ title, description, icon, examples, href, gradient, iconBg }: CategoryCardProps) {
  return (
    <Card className={`group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${gradient}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <CardHeader className="pb-4">
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Examples</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <span
                key={example}
                className="rounded-full bg-background/80 px-3 py-1 text-sm text-foreground"
              >
                {example}
              </span>
            ))}
          </div>
        </div>
        
        <Button asChild className="w-full group/btn">
          <Link href={href}>
            Browse {title}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function CategorySelection() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <CategoryCard
        title="Climacteric Fruits"
        description="Fruits that continue to ripen after harvest. They produce ethylene gas and can be stored to ripen at home."
        icon={<Sun className="h-7 w-7 text-amber-600" />}
        examples={["Apples", "Bananas", "Mangoes", "Avocados"]}
        href="/marketplace?category=climacteric"
        gradient="bg-gradient-to-br from-amber-50 to-orange-50"
        iconBg="bg-amber-100"
      />
      
      <CategoryCard
        title="Non-Climacteric Fruits"
        description="Fruits that do not ripen after harvest. They should be picked when fully ripe and consumed fresh."
        icon={<Snowflake className="h-7 w-7 text-sky-600" />}
        examples={["Oranges", "Grapes", "Strawberries", "Cherries"]}
        href="/marketplace?category=non-climacteric"
        gradient="bg-gradient-to-br from-sky-50 to-cyan-50"
        iconBg="bg-sky-100"
      />
    </div>
  )
}
