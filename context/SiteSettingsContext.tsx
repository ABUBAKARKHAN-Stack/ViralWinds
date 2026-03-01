"use client";
import { SiteSettingsData } from "@/helpers/site-settings.helpers";
import { createContext, useContext, ReactNode } from "react";

type SiteSettingsContextType = {
    settings: SiteSettingsData | null;
};

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

export const SiteSettingsProvider = ({
    children,
    settings
}: {
    children: ReactNode;
    settings: SiteSettingsData | null;
}) => {
    return (
        <SiteSettingsContext.Provider value={{ settings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = () => {
    const ctx = useContext(SiteSettingsContext);
    if (!ctx) throw new Error("useSiteSettings must be inside SiteSettingsProvider");
    return ctx;
};
