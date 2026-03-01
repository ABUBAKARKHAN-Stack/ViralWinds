"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LinkProcessorProps {
    text: string | undefined | null
    className?: string
    linkClassName?: string
}

export function LinkProcessor({ text, className, linkClassName }: LinkProcessorProps) {
    if (!text) return null


    const regex = /"([^"\s]+)\s+<([^>]+)>"/g

    const parts = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index))
        }

        const url = match[1]
        const label = match[2]
        const isInternal = url.startsWith("/") || url.includes(process.env.NEXT_PUBLIC_BASE_URL || "")

        if (isInternal) {
            parts.push(
                <Link
                    key={match.index}
                    href={url}
                    className={cn(
                        "text-accent hover:underline underline-offset-4 transition-all font-medium",
                        linkClassName
                    )}
                >
                    {label}
                </Link>
            )
        } else {
            parts.push(
                <a
                    key={match.index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "text-accent hover:underline underline-offset-4 transition-all font-medium",
                        linkClassName
                    )}
                >
                    {label}
                </a>
            )
        }

        lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex))
    }

    return (
        <span className={cn("whitespace-pre-wrap", className)}>
            {parts.length > 0 ? parts : text}
        </span>
    )
}
