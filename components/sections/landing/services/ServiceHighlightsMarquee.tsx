"use client"

import { Marquee } from "@/components/ui/marquee";
import { useLandingPageContent } from "@/context/LandingPageContentContext";


const ServiceHighlightsMarquee = () => {
    const { landingPageContent } = useLandingPageContent();

    const highlights = landingPageContent?.serviceHighlightsMarquee?.highlights || [];

    if (highlights.length === 0) return null;

    return (
        <Marquee className="[--duration:20s] py-8 border-y border-border">
            {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-8 px-8 whitespace-nowrap">
                    <span className="text-4xl md:text-6xl font-display font-bold tracking-tight text-muted-foreground/30 hover:text-accent transition-colors">
                        {item.text}
                    </span>
                    <span className="w-3 h-3 rounded-full bg-accent" />
                </div>
            ))}
        </Marquee>
    );
};

export default ServiceHighlightsMarquee;