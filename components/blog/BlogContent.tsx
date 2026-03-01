"use client"

import { portableTextComponents } from '@/lib/portable-components'
import { cn } from '@/lib/utils'
import { PortableText } from 'next-sanity'


interface BlogContentProps {
    content: any
    className?: string
}

export function BlogContent({ content, className }: BlogContentProps) {
    if (!content) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No content available
            </div>
        )
    }

    return (
        <article className={cn("max-w-none", className)}>
            <PortableText value={content} components={portableTextComponents} />
        </article>
    )
}
