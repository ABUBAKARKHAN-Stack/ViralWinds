import React from "react"
import Image from "next/image"

interface BeforeAfterProps {
    beforeImage: {
        url: string
        alt: string
    }
    afterImage: {
        url: string
        alt: string
    }
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ beforeImage, afterImage }) => {
    if (!beforeImage?.url || !afterImage?.url) return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-24">
            <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    Before
                </span>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-border group grayscale hover:grayscale-0 transition-all duration-700">
                    <Image
                        src={beforeImage.url}
                        alt={beforeImage.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
            <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                    After
                </span>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-accent/20 group shadow-lg">
                    <Image
                        src={afterImage.url}
                        alt={afterImage.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
        </div>
    )
}
