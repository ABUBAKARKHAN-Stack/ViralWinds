"use client"

import { ArrowUpRight } from "lucide-react";
import { getIconByName } from "@/lib/icon-mapper";
import MagneticButton from "@/components/MagneticButton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { resolveUrl } from "@/lib/menu-utils";
import { BRAND_DESCRIPTION } from "@/constants/app.constants";

const FooterMainGrid = () => {
    const { settings } = useSiteSettings()

    return (
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
                <Logo className="h-16 w-auto mb-6" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {settings?.footerText || BRAND_DESCRIPTION}
                </p>
                {/* Social Links */}
                <div className="flex gap-4 mt-8">
                    {settings?.social?.map((platform, index) => {
                        const Icon = getIconByName(platform.icon);
                        if (!Icon) return null;

                        return (
                            <MagneticButton key={index} strength={0.2}>
                                <a
                                    href={platform.url}
                                    aria-label={platform.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "group relative size-10 flex items-center justify-center overflow-hidden",
                                        "border border-border text-xs font-medium transition-colors",
                                        "hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon className="size-5 z-10" />
                                    <span
                                        className={cn(
                                            "absolute inset-0 z-0 bg-accent",
                                            "translate-y-full group-hover:translate-y-0",
                                            "transition-transform duration-300 ease-out"
                                        )}
                                    />
                                </a>
                            </MagneticButton>
                        );
                    })}
                </div>
            </div>

            {/* Dynamic Footer Menu Columns */}
            {(settings?.footerMenu?.items || []).map((column: any, colIndex: number) => (
                <div key={column._key || colIndex}>
                    <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
                        {column.label || "Menu"}
                    </h4>
                    <ul className="space-y-4">
                        {(column.children || []).map((item: any, index: number) => {
                            const href = resolveUrl(item);
                            const label = item.label || item.title;
                            return (
                                <li key={item._key || index}>
                                    <Link
                                        href={href}
                                        className="text-sm text-foreground/70 hover:text-accent transition-colors inline-flex items-center gap-2 group"
                                    >
                                        {label}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            ))}

            {/* Contact */}
            <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Get in Touch</h4>
                <ul className="space-y-4">
                    {settings?.contact && settings.contact.length > 0 ? (
                        settings.contact.map((item, index) => {
                            const Icon = getIconByName(item.icon);
                            const isEmail = item.label.toLowerCase().includes('email') || item.value.toLowerCase().includes('@');
                            const isPhone = item.label.toLowerCase().includes('phone') || /^\+?[\d\s-]{10,}$/.test(item.value);
                            const href = isEmail ? `mailto:${item.value}` : isPhone ? `tel:${item.value}` : null;

                            if (href) {
                                return (
                                    <li key={index}>
                                        <a href={href} className="flex items-center gap-3 text-sm text-foreground/70 hover:text-accent transition-colors">
                                            <Icon className="w-4 h-4" />
                                            {item.value}
                                        </a>
                                    </li>
                                )
                            }

                            return (
                                <li key={index}>
                                    <span className="flex items-center gap-3 text-sm text-foreground/70">
                                        <Icon className="w-4 h-4" />
                                        {item.value}
                                    </span>
                                </li>
                            )
                        })
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No contact info available.</p>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default FooterMainGrid