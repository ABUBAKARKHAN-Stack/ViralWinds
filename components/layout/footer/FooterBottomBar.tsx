"use client"

import { useSiteSettings } from "@/context/SiteSettingsContext";

const FooterBottomBar = () => {
    const currentYear = new Date().getFullYear();
    const { settings } = useSiteSettings();

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
                {settings?.copyright ? (
                    <span>{settings.copyright.replace("{year}", currentYear.toString())}</span>
                ) : (
                    <span>© {currentYear} Mohsin Designs. All rights reserved.</span>
                )}
            </p>
        </div>
    )
}

export default FooterBottomBar