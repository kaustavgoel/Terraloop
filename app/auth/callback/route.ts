import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard'

  // Handle OAuth errors from provider
  if (error_description) {
    console.error('[v0] OAuth error from provider:', error_description)
    const errorUrl = new URL('/auth/error', origin)
    errorUrl.searchParams.set('message', error_description)
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[v0] Error exchanging code for session:', error.message)
        const errorUrl = new URL('/auth/error', origin)
        errorUrl.searchParams.set('message', error.message)
        return NextResponse.redirect(errorUrl)
      }

      if (data.session) {
        console.log('[v0] Session established successfully for user:', data.user?.email)
        // Redirect to dashboard on successful auth
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('[v0] Unexpected error in auth callback:', err)
      const errorUrl = new URL('/auth/error', origin)
      errorUrl.searchParams.set('message', 'An unexpected error occurred during authentication')
      return NextResponse.redirect(errorUrl)
    }
  }

  // No code provided - redirect to error
  console.error('[v0] No authorization code provided in callback')
  const errorUrl = new URL('/auth/error', origin)
  errorUrl.searchParams.set('message', 'No authorization code received')
  return NextResponse.redirect(errorUrl)
}
