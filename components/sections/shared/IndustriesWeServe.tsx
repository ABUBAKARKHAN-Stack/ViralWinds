"use client"
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import SectionHeading from "@/components/ui/section-heading";
import { ContainerLayout } from "@/components/layout";
import { useGlobalContent } from "@/context/GlobalContentContext";
import { getIconByName } from "@/lib/icon-mapper";
import { LinkProcessor } from "@/components/ui/LinkProcessor";


const IndustriesWeServe = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
    const { globalContent } = useGlobalContent();

    const industriesWeServeData = globalContent?.industriesWeServe;
    const industriesData = industriesWeServeData?.industries || [];

    const statsData = globalContent?.stats;
    const statsArray = statsData ? [
        {
            value: industriesData.length.toString(),
            suffix: "+",
            label: "Industries"
        },
        statsData.yearsExperience,
        statsData.projectsDelivered,
        statsData.clientSatisfaction,
    ].filter(Boolean) : [];

    return (
        <section ref={containerRef} className="lg:py-12.5 py-6.25 relative overflow-hidden">

            {/* Background Elements */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-20 -left-40 w-100 h-100 bg-accent/10 rounded-full blur-3xl"
            />
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-20 -right-40 w-125 h-125 bg-primary/10 rounded-full blur-3xl"
            />

            <ContainerLayout className="relative z-10">
                <SectionHeading
                    eyebrow={industriesWeServeData?.sectionHeading?.eyebrow || "Industry Expertise"}
                    title={industriesWeServeData?.sectionHeading?.title || "Industries We Serve"}
                    description={industriesWeServeData?.sectionHeading?.description || "We've helped businesses across diverse industries achieve their digital goals with tailored solutions."}
                    align="center"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
                    {industriesData.map((industry, index) => {
                        const IconComponent = getIconByName(industry.iconName);

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="group"
                            >
                                <div className="relative h-full p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-105 transition-all duration-300">
                                        <IconComponent className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-base md:text-lg font-display font-bold leading-tight group-hover:text-accent transition-colors">
                                            {industry.name}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                                        <LinkProcessor text={industry.description} />
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Stats Bar */}
                {statsArray.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16"
                    >
                        <div className="p-8 md:p-10 rounded-2xl bg-accent">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 text-center">
                                {statsArray.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <div className="text-3xl md:text-4xl font-display font-bold text-accent-foreground mb-1">
                                            {stat?.value}
                                            {stat?.suffix}
                                        </div>
                                        <div className="text-sm text-accent-foreground/70">{stat?.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </ContainerLayout>
        </section>
    );
};

export default IndustriesWeServe;
