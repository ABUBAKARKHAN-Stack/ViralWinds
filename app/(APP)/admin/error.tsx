'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, Home, WifiOff } from 'lucide-react'
import Link from 'next/link'

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Admin Error:', error)
    }, [error])

    const isNetworkError = error.message?.toLowerCase().includes('fetch') ||
        error.message?.toLowerCase().includes('network') ||
        error.message?.toLowerCase().includes('failed to fetch')

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 rounded-full bg-destructive/10 p-6">
                {isNetworkError ? (
                    <WifiOff className="h-12 w-12 text-destructive" />
                ) : (
                    <AlertCircle className="h-12 w-12 text-destructive" />
                )}
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight">
                {isNetworkError ? 'Network Connection Failed' : 'Something went wrong!'}
            </h1>

            <p className="mb-8 max-w-md text-muted-foreground">
                {isNetworkError
                    ? "We couldn't connect to the server. Please check your internet connection and try again."
                    : error.message || "An unexpected error occurred while processing your request in the admin panel."}
            </p>

            <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button
                    onClick={() => reset()}
                    variant="default"
                    className="gap-2"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Try again
                </Button>

                <Button
                    variant="outline"
                    asChild
                    className="gap-2"
                >
                    <Link href="/admin/dashboard">
                        <Home className="h-4 w-4" />
                        Admin Dashboard
                    </Link>
                </Button>
            </div>

            {error.digest && (
                <p className="mt-8 text-xs text-muted-foreground">
                    Error Digest: <code className="rounded bg-muted px-1">{error.digest}</code>
                </p>
            )}
        </div>
    )
}
