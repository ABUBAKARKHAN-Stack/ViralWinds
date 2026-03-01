"use client"

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Link from "next/link";
import { ContainerLayout } from "@/components/layout";
import BlogCard from "@/components/cards/BlogCard";
import { BlogData, SectionHeadingType } from "@/types/services.types";

type Props = {
    sectionHeading: SectionHeadingType;
    blogs: BlogData[];
    buttonText: string;
    buttonUrl: string;
}

const ServicesBlogs = ({ sectionHeading, blogs, buttonText, buttonUrl }: Props) => {

    if (!sectionHeading || !blogs || !buttonText || !buttonUrl) return null;

    return (
        <section className="lg:py-12.5 py-6.25 bg-background relative overflow-hidden">

            {/* Subtle background accent */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-muted/30 to-transparent pointer-events-none" />

            <ContainerLayout className=" relative z-10">
                <SectionHeading
                    eyebrow={sectionHeading.eyebrow}
                    title={sectionHeading.title}
                    description={sectionHeading.description}
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    {blogs.map((post, index) => (
                        <BlogCard
                            key={`${post.slug}-${index}`}
                            post={post}
                            index={index}
                        />
                    ))}
                </div>

                {/* View All Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <Link href={buttonUrl} className="inline-flex items-center gap-3 group">
                        <span className="text-sm uppercase tracking-widest group-hover:text-accent transition-colors">
                            {buttonText}
                        </span>
                        <span className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-accent-foreground transition-all duration-300">
                            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                    </Link>
                </motion.div>
            </ContainerLayout>
        </section>
    );
};

export default ServicesBlogs;
