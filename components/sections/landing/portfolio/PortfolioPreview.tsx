"use client"

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { ContainerLayout } from "@/components/layout";
import PortfolioCard from "./PortfolioCard";
import SectionHeading from "@/components/ui/section-heading";
import { Marquee } from "@/components/ui/marquee";
import { useLandingPageContent } from "@/context/LandingPageContentContext";

const PortfolioPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const { landingPageContent } = useLandingPageContent();

  if (!landingPageContent?.portfolioPreview) return null;


  const portfolioPreviewData = landingPageContent.portfolioPreview;
  const featuredProjects = portfolioPreviewData.featuredProjects;



  const firstRow = featuredProjects.slice(0, featuredProjects.length / 2)
  const secondRow = featuredProjects.slice(featuredProjects.length / 2)


  return (
    <section ref={containerRef} className="lg:py-12.5 py-6.25 bg-card relative overflow-hidden ">
      <motion.div
        style={{ y }}
        className="absolute -left-40 bottom-0 w-150 h-150 bg-accent/5 rounded-full blur-3xl"
      />

      <ContainerLayout>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-20 gap-8">

          <SectionHeading
            eyebrow={portfolioPreviewData?.sectionHeading?.eyebrow || "Portfolio"}
            title={portfolioPreviewData?.sectionHeading?.title || "Selected Work"}
            description={portfolioPreviewData?.sectionHeading?.description || "Our portfolio reflects the diversity of brands we've worked with and the depth of challenges we've solved. Each project represents a balance between creativity and purpose."}
            className="mb-0 relative z-999"
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <Link
              href={portfolioPreviewData?.buttonUrl || "/portfolio"}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all duration-300 shadow-[0_10px_30px_-10px_hsl(var(--accent)/0.5)]"
            >
              <span>{portfolioPreviewData?.buttonText || "View All Projects"}</span>
              <ArrowUpRight className="size-4.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>

      </ContainerLayout>

      <div className="space-y-2">
        <Marquee pauseOnHover className="[--duration:15s] w-full">

          {firstRow.map((project, index) => (
            <PortfolioCard
              key={`${project.title}-${index}`}
              project={project}
            />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover className="[--duration:15s] ">
          {secondRow.map((project, index) => (
            <PortfolioCard
              key={index}
              project={project}
            />
          ))}
        </Marquee>

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
          href={`/portfolio`}
          className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all duration-300"
        >
          View All Projects
          <ArrowUpRight className="size-4.5" />
        </Link>
      </motion.div>

    </section>
  );
};

export default PortfolioPreview;
