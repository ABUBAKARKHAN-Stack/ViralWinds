"use client"

import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { urlFor } from "@/sanity/lib/image";
import { ServiceData } from "@/types/services.types";
import { ArrowUpRight } from "lucide-react";
import { useScroll, useTransform, motion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const ServiceCard = ({ service, index }: { service: {
    title: string;
    description: string;
    slug: string;
    heroImage: {
      alt: string;
      source: string;
    };
    items: string[];
  }; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
    const y = useTransform(scrollYProgress, [0, 0.3], [30, 0]);
    const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);

    const imageSrc = urlFor(service.heroImage.source).url()
    

    return (
        <Link href={`/services/${service.slug}`}>
            <motion.div
                ref={ref}
                style={{ opacity, y }}
                className="group relative cursor-pointer"
            >
                {/* Card Container */}
                <div className="relative py-12 md:py-16 lg:py-20 border-b border-border/30 hover:border-accent/60 transition-all duration-500">

                    {/* Accent line on hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                    <div className="grid md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start md:items-center pl-0 group-hover:pl-6 transition-all duration-500">

                        {/* Service Number - Mobile Only */}
                        <div className="md:hidden flex items-center gap-3 mb-2">
                            <span className="text-accent font-mono text-sm font-semibold tracking-wider">{index++}</span>
                            <span className="h-px w-8 bg-accent/50" />
                        </div>

                        {/* Service Image */}
                        <div className="md:col-span-3 order-first">
                            <div className="relative aspect-4/3 overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-accent/10 transition-all duration-500">
                                <motion.img
                                    style={{ scale: imageScale }}
                                    src={imageSrc}
                                    alt={service.heroImage.alt}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                {/* Number badge - Desktop Only */}
                                <div className="hidden md:flex absolute bottom-4 left-4 items-center gap-2">
                                    <span className="text-sm tracking-widest text-accent font-mono font-bold bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-accent/20">
                                        {index++}
                                    </span>
                                </div>


                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="md:col-span-5 space-y-4">
                            <motion.h3
                                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold line-clamp-2 tracking-tight leading-none group-hover:text-accent transition-colors duration-300"
                            >
                                {service.title}
                            </motion.h3>

                            {/* Description */}
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md line-clamp-4">
                                <LinkProcessor text={service.description} />
                            </p>
                        </div>

                        {/* Items */}
                        <div className="md:col-span-3">
                            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
                                {service.items.map((item, i) => (
                                    <motion.li
                                        key={item}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 + i * 0.03, duration: 0.4 }}
                                        className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-muted-foreground hover:text-foreground group-hover:translate-x-1 transition-all duration-300"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:scale-125 transition-all duration-300" />
                                        <span className="line-clamp-2">{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Arrow - Desktop Only */}
                        <div className="hidden md:flex md:col-span-1 justify-end">
                            <motion.div
                                className="size-12 md:size-14 xl:size-16 shrink-0 rounded-full border-2 border-border/40 flex items-center justify-center  group-hover:border-accent group-hover:bg-accent group-hover:scale-110 transition-all duration-500"
                            >
                                <ArrowUpRight className="size-5 xl:size-6 text-muted-foreground -rotate-45 group-hover:rotate-0 group-hover:text-accent-foreground transition-all duration-300" />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Hover background effect */}
                <div className="absolute inset-0 bg-linear-to-r from-accent/5 via-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />

            </motion.div>
        </Link>
    );
};

export default ServiceCard