"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Globe, ArrowRight, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { ContainerLayout } from "@/components/layout";
import { cn } from "@/lib/utils";
import { useLandingPageContent } from "@/context/LandingPageContentContext";
import Link from "next/link";


const AreasWeServe = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const globeRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const { landingPageContent } = useLandingPageContent()

    const areasWeServeData = landingPageContent?.areasWeServe;
    const areasData = areasWeServeData?.areas || [];

    return (
        <section ref={containerRef} className="lg:py-12.5 py-6.25 bg-muted/30 relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }} />
            </div>

            {/* Floating Animated Globes */}
            <motion.div
                style={{ rotate: globeRotate }}
                className="absolute top-20 right-[10%] w-80 h-80 opacity-[0.08]"
            >
                <div className="w-full h-full rounded-full border-2 border-dashed border-accent" />
                <div className="absolute inset-4 rounded-full border border-accent/50" />
                <div className="absolute inset-8 rounded-full border border-accent/30" />
            </motion.div>

            <motion.div
                style={{ y: backgroundY }}
                className="absolute -bottom-20 -left-20 w-96 h-96 bg-linear-to-br from-accent/20 to-transparent rounded-full blur-3xl"
            />

            {/* Floating Dots */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-accent/40 rounded-full"
                    style={{
                        top: `${20 + i * 15}%`,
                        left: `${10 + i * 15}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                    }}
                />
            ))}

            <ContainerLayout className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
                    <SectionHeading
                        eyebrow={areasWeServeData?.sectionHeading?.eyebrow || "Global Reach"}
                        title={areasWeServeData?.sectionHeading?.title || "Areas We Serve"}
                        description={areasWeServeData?.sectionHeading?.description || "Delivering exceptional digital solutions to businesses across the globe. Our remote-first approach means we can serve you anywhere."}
                        className="mb-0"
                    />

                    {/* Global Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex gap-8"
                    >
                        <div className="text-center">
                            <div className="text-4xl font-display font-bold text-accent">{areasData.length}</div>
                            <div className="text-sm text-muted-foreground">Continents</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-display font-bold text-accent">
                                {areasData.reduce((total, area) => total += area.locations.length, 0)}+
                            </div>
                            <div className="text-sm text-muted-foreground">Countries</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-display font-bold text-accent">
                                {areasData.reduce((total, area) => total += area.clients, 0)}+
                            </div>
                            <div className="text-sm text-muted-foreground">Clients</div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {areasData.map((area, index) => (
                        <motion.div
                            key={area.region}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="group relative"
                        >
                            <div className={cn(
                                "relative p-8 rounded-3xl border transition-all duration-500 h-full",
                                area.featured ? 'bg-linear-to-br from-accent/10 via-accent/5 to-transparent border-accent/30' : 'bg-card border-border/50',
                                "hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-3 hover:border-accent/60"
                            )}>
                                {/* Featured Sparkle */}
                                {area.featured && (
                                    <motion.div
                                        className="absolute -top-3 -right-3"
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/50">
                                            <Sparkles className="w-4 h-4 text-accent-foreground" />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Flag & Region */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-4xl">{area.flag}</span>
                                    <div>
                                        <h3 className="text-xl font-display font-bold">{area.region}</h3>
                                        <span className="text-xs text-muted-foreground">{area.clients} Clients</span>
                                    </div>
                                </div>

                                {/* Locations */}
                                <ul className="space-y-3 mb-6">
                                    {area.locations.map((location, locIndex) => (
                                        <motion.li
                                            key={location}
                                            className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={hoveredIndex === index ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                                            transition={{ delay: locIndex * 0.05 }}
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                            <span className="text-sm">{location}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Hover Action */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={hoveredIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                    className=" text-accent text-sm font-medium"
                                >
                                    <Link href={`/portfolio`} className="flex items-center gap-2">
                                        <span>View All Projects</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>

                                {/* Decorative Ring */}
                                <div className="absolute -bottom-2 -right-2 w-32 h-32 rounded-full border border-accent/10 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 relative"
                >
                    <div className="p-8 md:p-10 rounded-3xl bg-linear-to-r from-accent/20 via-primary/10 to-accent/20 border border-accent/20 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                                    <Globe className="w-7 h-7 text-accent" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-display font-bold">Don't see your location?</h4>
                                    <p className="text-muted-foreground text-sm">
                                        We work with clients worldwide. Let's connect!
                                    </p>
                                </div>
                            </div>
                            <motion.a
                                href={`/contact`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-accent text-accent-foreground font-medium rounded-full flex items-center gap-2 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-shadow"
                            >
                                <span>Get in Touch</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </ContainerLayout>
        </section>
    );
};

export default AreasWeServe;
