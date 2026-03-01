"use client"

import React from "react"
import { Twitter, Facebook, Linkedin, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { successToast } from "@/lib/toastNotifications"

interface ShareButtonsProps {
    title: string
    url?: string
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        successToast("Link copied to clipboard!")
    }

    const shareLinks = [
        {
            name: "X",
            icon: <Twitter className="h-4 w-4" />,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: "Facebook",
            icon: <Facebook className="h-4 w-4" />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="h-4 w-4" />,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
    ]

    return (
        <div className="flex items-center gap-4">
            <div className="flex gap-2">
                {shareLinks.map((link) => (
                    <Button
                        key={link.name}
                        variant="outline"
                        size="icon"
                        className="h-9 w-9  rounded-full"
                        asChild
                    >
                        <a href={link.href} target="_blank" rel="noopener noreferrer" title={`Share on ${link.name}`}>
                            {link.icon}
                        </a>
                    </Button>
                ))}
            </div>
            <div className="h-6 w-px bg-border mx-2" />
            <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="uppercase tracking-widest text-xs h-9"
            >
                <Link2 className="h-4 w-4 mr-2" />
                Copy Link
            </Button>
        </div>
    )
}
