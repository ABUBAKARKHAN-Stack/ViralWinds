"use client"

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { ContainerLayout } from "@/components/layout";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/section-heading";
import { useLandingPageContent } from "@/context/LandingPageContentContext";
import { useGlobalContent } from "@/context/GlobalContentContext";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

const AboutPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { landingPageContent } = useLandingPageContent();
  const { globalContent } = useGlobalContent()

  const aboutData = landingPageContent?.aboutPreview;
  const experienceStat = globalContent?.stats?.yearsExperience;

  if (!aboutData) return null;

  return (
    <section
      ref={containerRef}
      className="lg:py-12.5 py-6.25 relative overflow-hidden"
    >
      <motion.div className="absolute -right-40 top-20 w-125 h-125 bg-accent/5 rounded-full blur-3xl" />

      <ContainerLayout>
        <SectionHeading
          eyebrow={aboutData.sectionHeading.eyebrow || ""}
          title={aboutData.sectionHeading.title || ""}
          className="lg:max-w-xl lg:text-start text-center"
        />

        <div className="grid lg:grid-cols-3 grid-cols-1 place-items-center lg:place-content-start gap-20 lg:gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 lg:text-start z-999 text-center text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg"
          >
            {aboutData.leftDescriptions?.map((desc, index) => (
              <p key={index}>
                <LinkProcessor text={desc.text} />
              </p>
            ))}
          </motion.div>

          {/* Center Experience Stat */}
          {experienceStat && (
            <motion.div
              className="relative flex justify-center items-center w-full mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={cn(
                  "group text-center flex justify-center items-center flex-col bg-accent text-accent-foreground border border-border hover:border-secondary/40 rounded-full hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300",
                  "size-48 sm:size-56 md:size-64 lg:size-72 xl:size-80",
                  "max-w-[90vw] max-h-[90vw]"
                )}
              >
                <div className="font-display font-bold tracking-tight mb-2 sm:mb-3">
                  <NumberTicker
                    once={false}
                    value={Number(experienceStat.value) || 0}
                    suffix={experienceStat.suffix}
                    className="text-accent-foreground! text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                  />
                </div>
                <div className="text-xs xs:text-sm sm:text-base font-medium uppercase tracking-[0.15em] px-2 text-center">
                  {experienceStat.label}
                </div>
              </motion.div>

              {/* Outer circle */}
              <motion.div
                className={cn(
                  "absolute rounded-full border-accent border-2 z-10",
                  "size-64 sm:size-72 md:size-80 lg:size-88 xl:size-96",
                  "max-w-[92vw] max-h-[92vw]"
                )}
              />
            </motion.div>
          )}

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-6 z-999 lg:text-start text-center text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg"
          >
            {aboutData.rightDescriptions?.map((desc, index) => (
              <p key={index}>
                <LinkProcessor text={desc.text} />
              </p>
            ))}
          </motion.div>
        </div>

        {/* Learn More Link */}
        <Link href={aboutData.ctaUrl || "#"} className="flex justify-center lg:justify-start items-center gap-2 group mt-8 md:mt-12">
          <span className="border-b border-foreground pb-1 group-hover:border-accent group-hover:text-accent transition-colors font-medium">
            {aboutData.ctaText}
          </span>
          <ArrowUpRight className="size-4.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200 group-hover:text-accent" />
        </Link>
      </ContainerLayout>
    </section>
  );
};

export default AboutPreview;
