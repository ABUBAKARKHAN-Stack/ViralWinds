"use client"

import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { SectionHeadingType, ServiceProcess as ServiceProcessType } from "@/types/services.types";
import { motion, MotionValue, useScroll, useTransform } from "motion/react"
import { useRef } from "react";

type Props = {
    process: ServiceProcessType[];
    processSectionHeader: SectionHeadingType
}


const TimelineStep = ({
    step,
    index,
    isEven,
    isLast,
    scrollProgress,
    stepProgress
}: {
    step: ServiceProcessType;
    index: number;
    isEven: boolean;
    isLast: boolean;
    scrollProgress: MotionValue<number>;
    stepProgress: number;
}) => {

    const isActive = useTransform(
        scrollProgress,
        [Math.max(0, stepProgress - 0.1), stepProgress, Math.min(1, stepProgress + 0.1)],
        [0, 1, 1]
    );

    const nodeScale = useTransform(isActive, [0, 1], [0.8, 1]);
    const nodeBg = useTransform(isActive, [0, 1], ["hsl(var(--muted))", "hsl(var(--accent))"]);
    const textColor = useTransform(isActive, [0, 1], ["hsl(var(--muted-foreground))", "hsl(var(--accent))"]);

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative lg:grid lg:grid-cols-2 lg:gap-16 ${!isLast ? 'lg:pb-16' : ''}`}
        >
            {/* Timeline node - Desktop */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10">
                <div className="relative">
                    {/* Pulse ring */}
                    <motion.div
                        className="absolute inset-0 w-14 h-14 rounded-full bg-accent/30"
                        style={{
                            scale: useTransform(isActive, [0, 1], [0, 1.5]),
                            opacity: useTransform(isActive, [0, 0.5, 1], [0, 0.5, 0]),
                        }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Main circle */}
                    <motion.div
                        className="relative w-14 h-14 rounded-full border-2 border-accent flex items-center justify-center shadow-lg"
                        style={{
                            scale: nodeScale,
                            backgroundColor: nodeBg,
                            boxShadow: useTransform(isActive, [0, 1], ["0 0 0 0 transparent", "0 0 30px 5px hsl(var(--accent) / 0.3)"]),
                        }}
                    >
                        <motion.span
                            className="font-display font-bold text-lg"
                            style={{ color: useTransform(isActive, [0, 1], ["hsl(var(--accent))", "hsl(var(--accent-foreground))"]) }}
                        >
                            {step.step}
                        </motion.span>
                    </motion.div>
                </div>
            </div>

            {/* Content Card */}
            <motion.div
                className={`${isEven ? 'lg:pr-20 lg:text-right' : 'lg:col-start-2 lg:pl-20'}`}
                style={{
                    opacity: useTransform(isActive, [0, 0.5, 1], [0.6, 0.9, 1]),
                }}
            >
                <div className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1">
                    {/* Glass card background */}
                    <div className="absolute inset-0 bg-linear-to-br from-card via-card to-muted/30 backdrop-blur-sm" />

                    {/* Animated gradient border */}
                    <div className="absolute inset-0 rounded-3xl p-px bg-linear-to-br from-accent/50 via-border/50 to-accent/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Inner content container */}
                    <div className="relative bg-card/95 m-px rounded-[23px] p-6 md:p-8">
                        {/* Large step number watermark */}
                        <div className={`absolute ${isEven ? 'left-6' : 'right-6'} top-4 text-8xl md:text-9xl font-display font-bold text-muted/5 select-none pointer-events-none`}>
                            {step.step}
                        </div>

                        {/* Decorative gradient orb */}
                        <motion.div
                            className={`absolute ${isEven ? '-right-20' : '-left-20'} -top-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl pointer-events-none`}
                            style={{
                                opacity: useTransform(isActive, [0, 1], [0, 0.8]),
                                scale: useTransform(isActive, [0, 1], [0.5, 1]),
                            }}
                        />

                        {/* Mobile step number */}
                        <div className="lg:hidden flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/25">
                                <span className="text-accent-foreground font-display font-bold">{step.step}</span>
                            </div>

                        </div>

                        {/* Icon and Title row */}
                        <div className={`flex items-center gap-5 mb-5 ${isEven ? 'lg:flex-row-reverse' : ''}`}>

                            <div className={`${isEven ? 'lg:text-right' : ''}`}>
                                <motion.h3
                                    className="text-2xl md:text-3xl font-display font-bold mb-1"
                                    style={{ color: textColor }}
                                >
                                    {step.title}
                                </motion.h3>
                                <div className={`flex items-center gap-2 ${isEven ? 'lg:justify-end' : ''}`}>
                                    <div className="h-0.5 w-8 bg-linear-to-r from-accent to-transparent rounded-full" />
                                    <span className="text-xs text-muted-foreground font-medium">Step {index + 1}</span>
                                </div>
                            </div>
                        </div>

                        <p className={`text-muted-foreground leading-relaxed text-base relative z-10 ${isEven ? 'lg:text-right' : ''}`}>
                            <LinkProcessor text={step.desc} />
                        </p>

                        {/* Bottom accent line */}
                        <motion.div
                            className={`absolute bottom-0 ${isEven ? 'right-0' : 'left-0'} h-1 bg-linear-to-r from-accent via-accent/50 to-transparent rounded-full`}
                            style={{
                                width: useTransform(isActive, [0, 1], ["0%", "60%"]),
                            }}
                        />
                    </div>

                    {/* Arrow connector to timeline */}
                    <motion.div
                        className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 items-center ${isEven ? '-right-8' : '-left-8'}`}
                        style={{
                            opacity: useTransform(isActive, [0, 1], [0.3, 1]),
                        }}
                    >
                        <div className={`w-6 h-px bg-linear-to-r ${isEven ? 'from-transparent to-accent' : 'from-accent to-transparent'}`} />
                        <div className={`w-2 h-2 rounded-full bg-accent ${isEven ? '' : 'order-first'}`} />
                    </motion.div>
                </div>
            </motion.div>

            {/* Empty space for alternating layout */}
            {isEven && <div className="hidden lg:block" />}
        </motion.div>
    );
};



const ServiceProcess = ({ process, processSectionHeader }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section className="lg:py-12.5 py-6.25 bg-muted/30 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-150 h-150 bg-accent/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
            </div>

            <ContainerLayout className="relative">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center mb-16"
                >
                    <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-6 uppercase">
                        {processSectionHeader.eyebrow}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                        {processSectionHeader.title}<span className="text-accent">.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
                        <LinkProcessor text={processSectionHeader.description} />
                    </p>
                </motion.div>

                {/* Timeline Container */}
                <div ref={containerRef} className="relative mt-20">
                    {/* Central vertical line - Desktop (background) */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2" />

                    {/* Animated progress line - Desktop */}
                    <motion.div
                        className="hidden lg:block absolute left-1/2 top-0 w-0.5 bg-linear-to-b from-accent via-accent to-accent/50 -translate-x-1/2 origin-top"
                        style={{ height: lineHeight }}
                    />

                    {/* Progress glow effect */}
                    <motion.div
                        className="hidden lg:block absolute left-1/2 top-0 w-4 bg-accent/30 blur-md -translate-x-1/2 origin-top"
                        style={{ height: lineHeight }}
                    />

                    <div className="space-y-8 lg:space-y-0">
                        {process.map((step, index) => {
                            const isEven = index % 2 === 0;
                            const stepProgress = index / (process.length - 1);

                            return (
                                <TimelineStep
                                    key={`${index}-${step.title}`}
                                    step={step}
                                    index={index}
                                    isEven={isEven}
                                    isLast={index === process.length - 1}
                                    scrollProgress={scrollYProgress}
                                    stepProgress={stepProgress}
                                />
                            );
                        })}
                    </div>

                    {/* End marker */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="hidden lg:flex justify-center mt-8"
                    >
                        <motion.div
                            className="w-5 h-5 rounded-full bg-accent shadow-lg shadow-accent/30"
                            style={{
                                scale: useTransform(scrollYProgress, [0.9, 1], [0.5, 1]),
                                opacity: useTransform(scrollYProgress, [0.85, 1], [0.3, 1]),
                            }}
                        />
                    </motion.div>
                </div>
            </ContainerLayout>

        </section>
    );
};




export default ServiceProcess