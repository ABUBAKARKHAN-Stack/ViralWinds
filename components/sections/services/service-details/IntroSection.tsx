"use client"
import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { motion } from "motion/react";

interface IntroSectionProps {
    introTagLine: string
    introTitle: string;
    introContent: string;
    roleTitle: string;
    roleContent: string[];
}

const IntroSection = ({ introTitle, introContent, roleTitle, roleContent, introTagLine }: IntroSectionProps) => {
    return (
        <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-125 h-125 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-100 h-100 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <ContainerLayout className="relative">

                {/* Why Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto mb-20"
                >
                    <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-6 uppercase">
                        {introTagLine}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-8">
                        {introTitle}<span className="text-accent">.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        <LinkProcessor text={introContent} />
                    </p>
                </motion.div>

                {/* Role Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative">
                        {/* Decorative line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-accent via-accent/50 to-transparent hidden md:block" />

                        <div className="md:pl-10">
                            <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8">
                                {roleTitle}<span className="text-accent">.</span>
                            </h3>

                            <div className="space-y-6">
                                {roleContent.map((paragraph, index) => (
                                    <motion.p
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                        className="text-muted-foreground leading-relaxed text-lg"
                                    >
                                        <LinkProcessor text={paragraph} />
                                    </motion.p>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

            </ContainerLayout>
        </section>
    );
};

export default IntroSection;
