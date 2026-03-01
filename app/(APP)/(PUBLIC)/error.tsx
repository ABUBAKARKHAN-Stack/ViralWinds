"use client"

import { Button } from '@/components/ui/button'
import { RefreshCcw, Home, AlertTriangle, ShieldQuestion } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams()
  const lang = (params?.lang as string) || 'en'


  const isNetworkError = error.message?.toLowerCase().includes('fetch') ||
    error.message?.toLowerCase().includes('network') ||
    error.message?.toLowerCase().includes('failed to fetch')

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-24">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />

      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
        {isNetworkError ? (
          <AlertTriangle className="h-10 w-10 animate-pulse" />
        ) : (
          <ShieldQuestion className="h-10 w-10" />
        )}
      </div>

      <div className="max-w-xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {isNetworkError ? 'Connection Interrupted' : 'An unexpected glitch'}
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
          {isNetworkError
            ? "It seems your connection took a brief pause. We couldn't fetch the latest content from our servers. Please verify your internet and try again."
            : "We've encountered an unexpected error while preparing this page for you. Our team has been notified, but in the meantime, you can try refreshing."}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => reset()}
            size="lg"
            className="h-12 min-w-[160px] rounded-full gap-2 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            <RefreshCcw className="h-5 w-5" />
            Try again
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-12 min-w-[160px] rounded-full gap-2 text-base font-medium transition-all hover:bg-primary/5 hover:text-foreground/75 border-primary/20"
          >
            <Link href={`/${lang}`}>
              <Home className="h-5 w-5" />
              Return home
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 flex items-center gap-2 text-sm text-muted-foreground/60 transition-opacity hover:opacity-100">
        <span className="hidden sm:inline">Reference ID:</span>
        <code className="rounded border px-2 py-0.5 text-xs font-mono">{error.digest || 'ERR_CLIENT_SIDE'}</code>
      </div>
    </div>
  )
}