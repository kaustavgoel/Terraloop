"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get('message')

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-red-500/30 bg-card">
        <CardContent className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 
            className="mb-2 text-2xl font-bold text-foreground"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Authentication Error
          </h1>
          <p className="mb-4 text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
            There was a problem signing you in. Please try again.
          </p>
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-sm text-red-400" style={{ fontFamily: 'Lora, serif' }}>
                {errorMessage}
              </p>
            </div>
          )}
          <Button asChild className="w-full bg-[#d4af37] text-background hover:bg-[#b8962f]">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
