"use client"


import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { useAboutPageContent } from "@/context/AboutPageContentContext";
import { Globe2 } from "lucide-react";
import { motion } from "motion/react";

export const GlobalReachSection = () => {
    const { aboutPageContent } = useAboutPageContent();
    const grData = aboutPageContent?.globalReach;

    return (
        <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

            <ContainerLayout>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-sm tracking-[0.3em] text-accent uppercase">
                            {grData?.badge || "Remote-First"}
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mt-4 mb-6">
                            {grData?.heading || (
                                <>Global Reach & <span className="text-accent">Scale</span></>
                            )}
                        </h2>
                        <div className="text-muted-foreground text-lg leading-relaxed mb-6 space-y-4">
                            <p>
                                <LinkProcessor
                                    text={grData?.description1 || "Mohsin Designs serves clients across multiple continents through a remote-first model. Our global exposure allows us to understand diverse audiences, cultural expectations, and digital behaviors."}
                                />
                            </p>
                            <p>
                                <LinkProcessor
                                    text={grData?.description2 || "Despite geographic differences, our commitment remains consistent: clear communication, professional execution, and reliable results."}
                                />
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {(grData?.regions && grData.regions.length > 0 ? grData.regions : ["North America", "Europe", "Middle East", "Asia Pacific"]).map((region, index) => (
                                <motion.span
                                    key={region}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                    className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium"
                                >
                                    {region}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square bg-card border border-border rounded-3xl p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
                            <Globe2 className="w-32 h-32 md:w-48 md:h-48 text-accent/20" />

                            {/* Stats overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    {(grData?.stats && grData.stats.length > 0 ? grData.stats : [
                                        { value: "4+", label: "Continents" },
                                        { value: "10+", label: "Countries" },
                                        { value: "3000+", label: "Projects" },
                                        { value: "100%", label: "Remote" },
                                    ]).map((stat, index) => (
                                        <motion.div
                                            key={typeof stat.label === 'string' ? stat.label : index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                            className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-4"
                                        >
                                            <div className="text-2xl md:text-3xl font-display font-bold text-accent">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {typeof stat.label === 'string' ? stat.label : "Stat"}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </ContainerLayout>
        </section>
    );
};
