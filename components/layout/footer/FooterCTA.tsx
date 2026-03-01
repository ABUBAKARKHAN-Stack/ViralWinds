"use client"

import { motion } from "motion/react";
import MagneticButton from '@/components/MagneticButton';
import { ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Link from "next/link";

const FooterCTA = () => {
  const { settings } = useSiteSettings();
  const cta = settings?.footerCTA;

  const hoverVariants = {
    hovered: { rotate: 45, backgroundColor: "var(--color-foreground)",color: "var(--color-background)"  },
    rest: { rotate: 0, backgroundColor: "var(--color-accent)" },
  };

  const textVariants = {
    hovered: { color: "var(--color-accent)" },
    rest: { color: "inherit" },
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mb-24"
    >
      <Link href={cta?.buttonUrl || "/contact"}>
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
          initial="rest"
          whileHover="hovered"
          animate="rest"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              {cta?.eyebrow || "Have a project in mind?"}
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-none">
              {cta?.headingPrefix || "Let's work"}
              <br />
              <motion.span
                variants={textVariants}
                className="text-stroke"
              >
                {cta?.headingHighlight || "together"}
              </motion.span>
            </h2>
          </div>

          <div>
            {cta?.buttonText && (
              <span className="text-xs sr-only uppercase tracking-widest text-muted-foreground font-medium">
                {cta.buttonText}
              </span>
            )}
            <MagneticButton strength={0.3}>
              <motion.div
                className="flex items-center justify-center w-20 h-20 md:w-28 md:h-28"
                variants={hoverVariants}
              
              >
                <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10" />
              </motion.div>
            </MagneticButton>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default FooterCTA