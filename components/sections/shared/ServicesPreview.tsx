"use client"

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { ContainerLayout } from "@/components/layout";
import SectionHeading from "@/components/ui/section-heading";
import { useGlobalContent } from "@/context/GlobalContentContext";
import ServiceCard from "@/components/cards/ServiceCard";


const ServicesPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const { globalContent } = useGlobalContent()

  if (!globalContent?.servicesPreview) return null;

  const servicesPreviewData = globalContent?.servicesPreview;
  const featuredServices = servicesPreviewData?.featuredServices || [];

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <section ref={containerRef} className="lg:py-12.5 py-6.25 bg-background relative overflow-hidden">

      {/* Animated background elements */}
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute -left-32 top-32 w-125 h-125 bg-accent/5 rounded-full blur-[120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-32 bottom-32 w-100 h-100 bg-secondary/30 rounded-full blur-[100px]"
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-size-[80px_80px]" />

      <ContainerLayout className=" relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-20 gap-8">

          <SectionHeading
            eyebrow={servicesPreviewData?.sectionHeading?.eyebrow || "services"}
            title={servicesPreviewData?.sectionHeading?.title || "What We Do Best"}
            description={servicesPreviewData?.sectionHeading?.description || "We blend creativity with strategy and technology to build digital solutions that help brands grow with clarity and confidence."}
            className="mb-0"
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <Link
              href={servicesPreviewData?.buttonUrl || "/services"}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all duration-300 shadow-[0_10px_30px_-10px_hsl(var(--accent)/0.5)]"
            >
              <span>{servicesPreviewData?.buttonText || "View All Services"}</span>
              <ArrowUpRight className="size-4.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {featuredServices.map((service, index) => (
            <ServiceCard key={`${service._id}-${index}`} service={service} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 lg:hidden text-center"
        >
          <Link
            href={servicesPreviewData?.buttonUrl || "/services"}
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all duration-300"
          >
            <span>{servicesPreviewData?.buttonText || "View All Services"}</span>
            <ArrowUpRight className="size-4.5" />
          </Link>
        </motion.div>
      </ContainerLayout>
    </section>
  );
};

export default ServicesPreview;
