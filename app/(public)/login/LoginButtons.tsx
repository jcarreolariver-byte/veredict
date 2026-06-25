'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function LoginButtons() {
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null)
  const supabase = createClient()

  const signIn = async (provider: 'google' | 'apple') => {
    setLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    if (error) setLoading(null)
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => signIn('google')}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-4 text-sm font-medium tracking-wide transition-all hover:bg-muted disabled:opacity-50"
      >
        {loading === 'google' ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      <button
        onClick={() => signIn('apple')}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-4 text-sm font-medium tracking-wide transition-all hover:bg-muted disabled:opacity-50"
      >
        {loading === 'apple' ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        ) : (
          <AppleIcon />
        )}
        Continue with Apple
      </button>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <path d="M14.05 9.55c-.02-2.12 1.73-3.14 1.81-3.19-1-1.44-2.54-1.64-3.08-1.66-1.31-.13-2.56.77-3.23.77-.67 0-1.7-.75-2.8-.73C5.23 4.76 3.74 5.65 2.92 7.04c-1.67 2.85-.43 7.08 1.2 9.39.8 1.14 1.74 2.42 2.98 2.37 1.2-.05 1.65-.77 3.1-.77 1.45 0 1.86.77 3.13.75 1.29-.02 2.1-1.17 2.88-2.32.92-1.33 1.29-2.62 1.31-2.68-.03-.01-2.5-.96-2.53-3.23zM11.8 3.1c.66-.8 1.1-1.91.98-3.02-.95.04-2.1.63-2.78 1.42-.61.69-1.14 1.81-.99 2.87.99.08 2.03-.5 2.79-1.27z"/>
    </svg>
  )
}
