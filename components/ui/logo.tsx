"use client"
import { APP_NAME } from '@/constants/app.constants'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'


interface LogoProps extends Omit<ImageProps, 'alt' | 'src'> {
    className?: string
}

const Logo = ({ className = "", ...props }: LogoProps) => {
    const { settings } = useSiteSettings()

    // Use dynamic logo from settings, or fallback to default
    const logoSrc = settings?.logo?.url || "/assets/logo.png"
    const appName = settings?.siteName || APP_NAME

    return (
        <Image
            src={logoSrc}
            alt={settings?.logo?.altText || appName}
            height={50}
            width={50}
            {...props}
            unoptimized
            className={cn(
                "h-12.5 w-auto object-contain drop-shadow-[0_6px_16px_hsl(var(--foreground)/0.18)] ",
                className
            )}
        />
    )
}

export default Logo