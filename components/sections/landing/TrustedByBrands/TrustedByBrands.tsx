"use client"

import { motion } from "motion/react";
import { ContainerLayout } from "@/components/layout";
import { Marquee } from "@/components/ui/marquee";
import TrustedByBrandsCard from "./TrustedByBrandsCard";
import { useLandingPageContent } from "@/context/LandingPageContentContext";
import { LinkProcessor } from "@/components/ui/LinkProcessor";


const TrustedByBrands = () => {
  const { landingPageContent } = useLandingPageContent();

  const trustedByBrandsData = landingPageContent?.trustedByBrands;
  const brandLogos = trustedByBrandsData?.brandLogos || [];

  if (brandLogos.length === 0) return null;

  const firstRow = brandLogos.slice(0, Math.ceil(brandLogos.length / 2));
  const secondRow = brandLogos.slice(Math.ceil(brandLogos.length / 2));
  return (
    <section className="lg:py-12.5 py-6.25  border-y border-border bg-muted/30 overflow-hidden">

      <ContainerLayout className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {trustedByBrandsData?.sectionHeading?.eyebrow || "Our Clients"}
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            {trustedByBrandsData?.sectionHeading?.title || "Trusted By Leading Brands"}
          </h2>
          {trustedByBrandsData?.sectionHeading?.description && (
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              <LinkProcessor text={trustedByBrandsData.sectionHeading.description} />
            </p>  
          )}
        </motion.div>
      </ContainerLayout>

      {/* Dual Marquee Rows */}
      <div className="relative space-y-6">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0  md:w-6 w-2 bg-linear-to-r from-muted/95 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 md:w-6 w-2 bg-linear-to-l from-muted/95 to-transparent z-10 pointer-events-none" />

        {/* Row 1 - Left direction */}

        <Marquee pauseOnHover className="[--duration:25s] [--gap:0rem] md:[--gap:1.5rem]">
          {firstRow.map((brand, i) => (
            <TrustedByBrandsCard
              key={brand.asset?._id || i}
              brand={{
                altText: brand.asset?.altText || "Brand",
                logo: brand.asset?.url || ""
              }}
            />
          ))}
        </Marquee>

        {/* Row 2 - Right direction (opposite) */}
        <Marquee reverse pauseOnHover className="[--duration:20s] [--gap:0rem] md:[--gap:1.5rem]">
          {secondRow.map((brand, i) => (
            <TrustedByBrandsCard
              key={brand.asset?._id || i}
              brand={{
                altText: brand.asset?.altText || "Brand",
                logo: brand.asset?.url || ""
              }}
            />
          ))}
        </Marquee>

      </div>

    </section>
  );
};

export default TrustedByBrands;
