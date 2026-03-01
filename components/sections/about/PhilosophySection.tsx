"use client"

import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { useAboutPageContent } from "@/context/AboutPageContentContext";
import { getIconByName } from "@/lib/icon-mapper";
import { ArrowRight, Compass } from "lucide-react";
import { motion } from "motion/react";

export const PhilosophySection = () => {
    const { aboutPageContent } = useAboutPageContent();
    const phData = aboutPageContent?.philosophy;

    const steps = phData?.steps?.length ? phData.steps : [
        { iconName: "Lightbulb", label: "Ideate" },
        { iconName: "Compass", label: "Strategize" },
        { iconName: "PenTool", label: "Design" },
        { iconName: "Rocket", label: "Launch" },
    ];

    return (
        <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/2 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/5 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent/10 rounded-full" />
            </div>

            <ContainerLayout className="relative z-10">

                <div className="max-w-4xl mx-auto text-center">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block text-sm tracking-[0.3em] text-accent uppercase bg-accent/10 px-4 py-2 mb-4">
                            {phData?.sectionHeading?.eyebrow || "Our Philosophy"}
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mt-4 mb-4">
                            {phData?.sectionHeading?.title ? (
                                phData.sectionHeading.title.split(' ').map((word, i, arr) => (
                                    word.toLowerCase() === 'before' ? (
                                        <span key={i} className="relative inline-block mx-2">
                                            <span className="bg-linear-to-r from-accent to-accent/70 bg-clip-text text-transparent">{word}</span>
                                            <motion.span
                                                initial={{ scaleX: 0 }}
                                                whileInView={{ scaleX: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.4, duration: 0.5 }}
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent origin-left"
                                            />
                                        </span>
                                    ) : word + " "
                                ))
                            ) : (
                                <>
                                    Strategy{" "}
                                    <span className="relative inline-block">
                                        <span className="bg-linear-to-r from-accent to-accent/70 bg-clip-text text-transparent">Before</span>
                                        <motion.span
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent origin-left"
                                        />
                                    </span>{" "}
                                    Design
                                </>
                            )}
                        </h2>
                    </motion.div>

                    {/* Quote block */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative my-12"
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-accent/50 text-8xl font-serif animate-pulse">"</div>
                        <p className="text-xl md:text-2xl text-foreground/80 font-medium leading-relaxed py-2 italic px-8">
                            <LinkProcessor
                                text={phData?.quoteBlock || "A website is not just a collection of pages. A logo is not just a symbol. A brand is not just visuals."}
                            />
                        </p>
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-accent/50 text-8xl font-serif rotate-180 animate-pulse">"</div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-5 text-lg text-muted-foreground leading-relaxed mt-16"
                    >
                        <p>
                            <LinkProcessor
                                text={phData?.description1 || "At Mohsin Designs, design is never created in isolation. Every color choice, layout decision, animation, and line of content exists to serve a purpose."}
                            />
                        </p>
                        <p>
                            <LinkProcessor
                                text={phData?.description2 || "Before we design anything, we seek to understand the business, the audience, the market, and the goal. Only then do we translate that understanding into visual and digital solutions that work together as a system."}
                            />
                        </p>
                    </motion.div>

                    {/* Process steps */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-14 flex flex-wrap justify-center items-center gap-3 md:gap-4"
                    >
                        {steps.map((step, i) => {
                            const Icon = getIconByName(step.iconName) || Compass;
                            return (
                                <div key={i} className="flex items-center gap-3 md:gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                        whileHover={{ scale: 1.1, y: -4 }}
                                        className="group relative flex flex-col items-center gap-2"
                                    >
                                        <div className={`w-16 h-16 md:w-18 md:h-18 flex items-center justify-center transition-all duration-300 ${i === steps.length - 1
                                            ? 'bg-accent shadow-lg shadow-accent/30'
                                            : 'bg-accent/10 group-hover:bg-accent/20'
                                            }`}>
                                            <Icon className={`w-7 h-7 md:w-8 md:h-8 ${i === steps.length - 1
                                                ? 'text-accent-foreground'
                                                : 'text-accent'
                                                }`} />
                                        </div>
                                        <span className={`text-xs tracking-wider uppercase font-medium ${i === steps.length - 1
                                            ? 'text-accent'
                                            : 'text-muted-foreground'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </motion.div>

                                    {i < steps.length - 1 && (
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.7 + i * 0.1 }}
                                            className="hidden sm:flex items-center origin-left"
                                        >
                                            <div className="w-8 md:w-12 h-px bg-linear-to-r from-accent/50 to-accent/20" />
                                            <ArrowRight className="w-4 h-4 text-accent/40" />
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </ContainerLayout>
        </section>
    );
};
