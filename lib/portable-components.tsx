import { urlFor } from '@/sanity/lib/image'
import { PortableTextComponents as PTComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

export const portableTextComponents: PTComponents = {
    block: {
        h1: ({ children }) => (
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 mt-12 first:mt-0 gradient-text">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-5 mt-10 gradient-text">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl md:text-3xl font-display font-semibold mb-4 mt-8 text-foreground">
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-xl md:text-2xl font-display font-semibold mb-3 mt-6 text-foreground">
                {children}
            </h4>
        ),
        h5: ({ children }) => (
            <h5 className="text-lg md:text-xl font-display font-semibold mb-3 mt-5 text-foreground">
                {children}
            </h5>
        ),
        h6: ({ children }) => (
            <h6 className="text-base md:text-lg font-display font-semibold mb-2 mt-4 text-foreground">
                {children}
            </h6>
        ),
        normal: ({ children }) => (
            <p className="text-base md:text-lg leading-relaxed mb-6 text-foreground/90">
                {children}
            </p>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent py-2 px-4 my-6 italic text-muted-foreground bg-muted/20 rounded-r-lg">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-foreground/90">
                {children}
            </ul>
        ),
        number: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-foreground/90">
                {children}
            </ol>
        ),
    },
    listItem: {
        bullet: ({ children }) => (
            <li className="pl-2 leading-relaxed marker:text-accent">{children}</li>
        ),
        number: ({ children }) => (
            <li className="pl-2 leading-relaxed marker:text-accent marker:font-semibold">{children}</li>
        ),
    },
    marks: {
        strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
            <em className="italic">{children}</em>
        ),
        code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-accent border border-border">
                {children}
            </code>
        ),
        link: ({ children, value }) => {
            const isExternal = value?.href?.startsWith('http')
            return (
                <Link
                    href={value?.href || '#'}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="text-accent hover:text-accent/80 underline decoration-accent/30 hover:decoration-accent/60 transition-colors font-medium"
                >
                    {children}
                </Link>
            )
        },
    },
    types: {
        image: ({ value }) => {
            if (!value?.asset) return null

            // Handle both direct URL and asset reference
            const imageUrl = urlFor(value.asset._ref)
            .quality(100)
            .format('webp')
            .auto('format')
            .url()
            const altText = value.alt || 'Blog image'

            return (
                <figure className="my-8">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                        <Image
                            src={imageUrl}
                            alt={altText}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="text-sm text-muted-foreground text-center mt-3 italic">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            )
        },
        code: ({ value }) => (
            <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto my-6">
                <code className="text-sm font-mono text-foreground">{value.code}</code>
            </pre>
        ),
    },
}