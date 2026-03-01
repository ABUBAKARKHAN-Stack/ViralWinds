"use client"

import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { useAboutPageContent } from "@/context/AboutPageContentContext";
import { Compass, Eye, Lightbulb, Target } from "lucide-react";
import { useScroll, motion, useTransform } from "motion/react";
import { useRef } from "react";

export const MissionVisionSection = () => {
    const { aboutPageContent } = useAboutPageContent();
    const mvData = aboutPageContent?.missionVision;

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const floatY1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const floatY2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
    const rotateIcon = useTransform(scrollYProgress, [0, 1], [0, 15]);

    return (
        <section ref={containerRef} className="lg:py-12.5 py-6.25 bg-muted/30 relative overflow-hidden">

            {/* Animated Background Pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">

                {/* Floating linear orbs */}
                <motion.div
                    style={{ y: floatY1 }}
                    className="absolute top-20 left-[10%] w-96 h-96 bg-linear-to-br from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl"
                />
                <motion.div
                    style={{ y: floatY2 }}
                    className="absolute bottom-10 right-[5%] w-80 h-80 bg-linear-to-tl from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"
                />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `linear-linear(hsl(var(--foreground)) 1px, transparent 1px), linear-linear(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />

                {/* Floating decorative icons */}
                <motion.div
                    style={{ y: floatY1, rotate: rotateIcon }}
                    className="absolute top-32 right-[15%] text-accent/10"
                >
                    <Lightbulb className="w-20 h-20" />
                </motion.div>
                <motion.div
                    style={{ y: floatY2, rotate: rotateIcon }}
                    className="absolute bottom-40 left-[12%] text-accent/10"
                >
                    <Compass className="w-16 h-16" />
                </motion.div>
            </div>

            <ContainerLayout className="relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block text-sm tracking-[0.3em] text-accent uppercase bg-accent/10 px-4 py-2 mb-4"
                    >
                        {mvData?.sectionHeading?.eyebrow || "What Drives Us"}
                    </motion.span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mt-4">
                        {mvData?.sectionHeading?.title ? (
                            mvData.sectionHeading.title.split(' ').map((word, i, arr) => (
                                i === arr.length - 1 ? (
                                    <span key={i} className="relative">
                                        <span className="bg-linear-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
                                            {word}
                                        </span>
                                        <motion.span
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5, duration: 0.6 }}
                                            className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-accent to-accent/30 origin-left"
                                        />
                                    </span>
                                ) : word + " "
                            ))
                        ) : (
                            <>
                                Our Purpose &{" "}
                                <span className="relative">
                                    <span className="bg-linear-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
                                        Direction
                                    </span>
                                    <motion.span
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                        className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-accent to-accent/30 origin-left"
                                    />
                                </span>
                            </>
                        )}
                    </h2>
                    <p className={"text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed mx-auto"}>
                        <LinkProcessor text={mvData?.sectionHeading?.description} />
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, rotateY: -5 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative group perspective-1000"
                    >
                        {/* Glow effect on hover */}
                        <div className="absolute -inset-1 bg-linear-to-br from-accent/20 via-accent/5 to-transparent rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />

                        <div className="relative bg-card border border-border p-8 md:p-10 lg:p-12 h-full rounded-sm overflow-hidden group-hover:border-accent/40 transition-all duration-500">
                            {/* Top accent bar */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-accent via-accent/80 to-accent/20 origin-left"
                            />

                            {/* Watermark icon */}
                            <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                                <Target className="w-48 h-48" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center gap-5 mb-8 relative">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="w-18 h-18 bg-linear-to-br from-accent to-accent/80 flex items-center justify-center rounded-sm shadow-lg shadow-accent/20"
                                >
                                    <Target className="w-9 h-9 text-accent-foreground" />
                                </motion.div>
                                <div>
                                    <span className="text-xs tracking-[0.25em] text-accent uppercase font-medium">
                                        {mvData?.mission?.eyebrow || "Purpose"}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-display font-bold mt-1">
                                        {mvData?.mission?.title || "Our Mission"}
                                    </h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-5 relative">
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    <LinkProcessor
                                        text={mvData?.mission?.description1 || "To help businesses present themselves with clarity and confidence in the digital world. A strong brand should communicate instantly, build trust naturally, and support long-term growth."}
                                    />
                                </p>

                                <div className="relative py-4">
                                    <div className="h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
                                    <motion.div
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-accent to-transparent"
                                    />
                                </div>

                                {mvData?.mission?.description2 && (
                                    <p className="text-foreground/80 leading-relaxed">
                                        <LinkProcessor
                                            text={mvData.mission.description2}
                                        />
                                    </p>
                                )}

                                {/* Key points */}
                                <div className="flex flex-wrap gap-3 pt-4">
                                    {(mvData?.mission?.keyPoints?.length ? mvData.mission.keyPoints : ["Clarity", "Trust", "Growth"]).map((item, i) => (
                                        <motion.span
                                            key={item}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            className="px-3 py-1.5 bg-accent/10 text-accent text-sm font-medium border border-accent/20"
                                        >
                                            {item}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>

                            {/* Corner decoration */}
                            <motion.div
                                className="absolute -bottom-2 -right-2 w-16 h-16 border-r-2 border-b-2 border-accent/30"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                            />
                        </div>
                    </motion.div>

                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotateY: 5 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                        className="relative group perspective-1000"
                    >
                        {/* Glow effect on hover */}
                        <div className="absolute -inset-1 bg-linear-to-bl from-accent/20 via-accent/5 to-transparent rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />

                        <div className="relative bg-card border border-border p-8 md:p-10 lg:p-12 h-full rounded-sm overflow-hidden group-hover:border-accent/40 transition-all duration-500">
                            {/* Top accent bar */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-accent/20 via-accent/80 to-accent origin-right"
                            />

                            {/* Watermark icon */}
                            <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                                <Eye className="w-48 h-48" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center gap-5 mb-8 relative">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: -5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="w-18 h-18 bg-linear-to-br from-accent to-accent/80 flex items-center justify-center rounded-sm shadow-lg shadow-accent/20"
                                >
                                    <Eye className="w-9 h-9 text-accent-foreground" />
                                </motion.div>
                                <div>
                                    <span className="text-xs tracking-[0.25em] text-accent uppercase font-medium">
                                        {mvData?.vision?.eyebrow || "Direction"}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-display font-bold mt-1">
                                        {mvData?.vision?.title || "Our Vision"}
                                    </h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-5 relative">
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    <LinkProcessor
                                        text={mvData?.vision?.description1 || "We envision a digital space where businesses are represented honestly, professionally, and strategically."}
                                    />
                                </p>

                                <div className="relative py-4">
                                    <div className="h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
                                    <motion.div
                                        animate={{ x: ["100%", "-100%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-accent to-transparent"
                                    />
                                </div>

                                {mvData?.vision?.description2 ? (
                                    <p className="text-foreground/80 leading-relaxed">
                                        <LinkProcessor
                                            text={mvData.vision.description2}
                                        />
                                    </p>
                                ) : (
                                    !mvData?.vision && (
                                        <p className="text-foreground/80 leading-relaxed">
                                            In a market crowded with generic designs and copy-paste solutions, Mohsin Designs aims to
                                            raise the standard. We strive to become a long-term digital partner for brands that care
                                            about quality, consistency, and sustainable growth.
                                        </p>
                                    )
                                )}

                                {/* Key points */}
                                <div className="flex flex-wrap gap-3 pt-4">
                                    {(mvData?.vision?.keyPoints?.length ? mvData.vision.keyPoints : ["Quality", "Consistency", "Partnership"]).map((item, i) => (
                                        <motion.span
                                            key={item}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.6 + i * 0.1 }}
                                            className="px-3 py-1.5 bg-accent/10 text-accent text-sm font-medium border border-accent/20"
                                        >
                                            {item}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>

                            {/* Corner decoration */}
                            <motion.div
                                className="absolute -bottom-2 -left-2 w-16 h-16 border-l-2 border-b-2 border-accent/30"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7 }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Bottom connector line */}
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex justify-center mt-16 origin-top"
                >
                    <div className="w-px h-16 bg-linear-to-b from-accent/50 to-transparent" />
                </motion.div>
            </ContainerLayout>
        </section>
    );
};
