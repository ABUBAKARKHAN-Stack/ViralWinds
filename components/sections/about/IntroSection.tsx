"use client"

import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { useAboutPageContent } from "@/context/AboutPageContentContext";
import { useGlobalContent } from "@/context/GlobalContentContext";
import { useScroll, useTransform, motion } from "motion/react";
import { useRef } from "react";


export const IntroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { aboutPageContent } = useAboutPageContent();
    const { globalContent } = useGlobalContent()
    const introData = aboutPageContent?.intro;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="lg:py-12.5 py-6.25 relative overflow-hidden">

            <motion.div
                style={{ y }}
                className="absolute -right-40 top-20 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"
            />

            <ContainerLayout>
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="text-sm tracking-[0.3em] text-accent uppercase">
                            {introData?.badge || "Who We Are"}
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mt-4 leading-tight">
                            {introData?.heading || "A Creative Digital Agency Built for Growth"}
                        </h2>
                        <div className="text-muted-foreground text-lg mt-8 leading-relaxed space-y-4">
                            <p>
                                <LinkProcessor text={introData?.description1 || "Mohsin Designs is a full-service creative digital agency dedicated to helping businesses build strong brands, establish authority, and grow with confidence in competitive markets."} />
                            </p>
                            <p>
                                <LinkProcessor text={introData?.description2 || "We work with entrepreneurs, startups, and established businesses to transform ideas into clear, consistent, and results-driven digital experiences. From branding to web design, SEO, and paid advertising — strategy, creativity, and execution under one roof."} />
                            </p>
                        </div>
                        {introData?.quote && (
                            <p className="text-foreground/80 py-2 italic bg-accent/10 font-medium text-lg mt-6 border-l-2 border-accent pl-4">
                                <LinkProcessor text={introData.quote} />
                            </p>
                        )}
                        {!introData?.quote && (
                            <p className="text-foreground/80 py-2 italic bg-accent/10 font-medium text-lg mt-6 border-l-2 border-accent pl-4">
                                Our clients don't come to us for trends. They come to us for clarity, structure, and outcomes.
                            </p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-4/5 bg-muted rounded-sm overflow-hidden relative">
                            <img
                                src={introData?.mainImage?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"}
                                alt="Team collaboration"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-transparent" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 md:p-8"
                        >
                            <div className="text-4xl md:text-5xl font-bold">
                                {globalContent?.stats?.since?.value || "2019"}
                            </div>
                            <div className="text-base mt-1 font-medium">
                                {globalContent?.stats?.since?.label || "Since"}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </ContainerLayout>
        </section>
    );
};