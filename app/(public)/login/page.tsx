import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginButtons } from './LoginButtons'
import { PrivacyBadge } from '@/components/verdict/PrivacyBadge'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/feed')

  const { error } = await searchParams

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-10">

        {/* Logo */}
        <div className="text-center space-y-2">
          <h1
            className="text-5xl font-bold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Verdict
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide">
            The world&apos;s moral pulse. One dilemma at a time.
          </p>
        </div>

        {/* Error */}
        {error === 'auth_failed' && (
          <p className="text-center text-sm text-destructive">
            Sign-in failed. Please try again.
          </p>
        )}

        {/* Buttons */}
        <LoginButtons />

        {/* Privacy */}
        <PrivacyBadge />

      </div>
    </main>
  )
}
