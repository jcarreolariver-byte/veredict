import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const supabase = await createClient()

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
        Settings
      </h1>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-xl border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}
