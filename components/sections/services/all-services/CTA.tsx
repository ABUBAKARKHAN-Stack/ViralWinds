"use client"

import { ContainerLayout } from "@/components/layout";
import AnimatedBadge from "@/components/ui/animated-badge";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { ServiceCTA } from "@/types/services.types";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react"
import Link from "next/link";
import { useRef } from "react";

type Props = {
    cta: ServiceCTA
}
const CTA = ({
    cta
}: Props) => {
    const ctaRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ctaRef,
        offset: ["start end", "end start"],
    });

    const ctaY = useTransform(scrollYProgress, [0, 1], [100, -50]);
    const ctaOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    return (
        <motion.div
            ref={ctaRef}
            style={{ y: ctaY, opacity: ctaOpacity }}
            className="lg:py-12.5 py-6.25"
        >
            <ContainerLayout className="relative">

                {/* CTA Background Card */}
                <div className="relative bg-linear-to-br from-card via-card to-muted/30 border border-border/50 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden">


                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

                    {/* Sparkle decorations */}
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute top-8 right-12 text-accent/30"
                    >
                        <Sparkles className="w-8 h-8" />
                    </motion.div>



                    <div className="relative z-10">

                        {/* Label */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <AnimatedBadge className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-8">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <span className="text-accent text-sm font-medium tracking-wide">{cta.badgeText}</span>
                            </AnimatedBadge>

                        </motion.div>

                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
                            <div className="space-y-6 max-w-2xl">
                                <motion.h2
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight leading-none"
                                >
                                    {(() => {
                                        const words = cta.title.split(" ");
                                        const lastWord = words.pop();
                                        const rest = words.join(" ");
                                        return (
                                            <>
                                                {rest} <span className="text-accent">{lastWord}</span>
                                            </>
                                        );
                                    })()}
                                </motion.h2>


                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-muted-foreground text-lg md:text-xl leading-relaxed"
                                >
                                    <LinkProcessor text={cta.description} />
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="shrink-0"
                            >

                                <Link
                                    href={cta.url}
                                    className="group relative inline-flex items-center gap-4 text-lg font-medium bg-accent text-accent-foreground px-10 py-5 overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(var(--accent),0.3)]"
                                >
                                    <span className="relative z-10">{cta.buttonText}</span>
                                    <ArrowUpRight className="relative z-10 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                                    <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Link>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </ContainerLayout>
        </motion.div>
    )
}

export default CTA