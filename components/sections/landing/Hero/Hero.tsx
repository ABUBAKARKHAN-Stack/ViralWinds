"use client"

import { useRef } from "react";
import ContainerLayout from "@/components/layout/ContainerLayout";
import BgElements from "./BgElements";
import { useScroll, useTransform } from "motion/react";
import HeroMainSection from "./HeroMainSection";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  //* Sleek Parallax
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden lg:py-12.5 py-6.25">

      {/* Background elements */}
      <BgElements />

      <ContainerLayout className="relative z-10">

        {/* Top Section: Badge, Heading, Description, Visual */}
        <HeroMainSection y={y} />


      </ContainerLayout>
    </section>
  );
};

export default Hero;