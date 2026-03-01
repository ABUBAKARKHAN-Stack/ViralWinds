"use client"

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import SplitText from "./split-text";
import { LinkProcessor } from "./LinkProcessor";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  splitText?: boolean;
}

const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  splitText = false
}: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn("mb-16 max-w-3xl", align === "center" && "text-center mx-auto", className)}
    >
      {eyebrow && (
        <span className="text-sm block tracking-[0.3em] text-accent uppercase font-medium mb-4">
          {eyebrow}
        </span>
      )}

      {
        splitText
          ?
          <SplitText className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            {title}
          </SplitText>
          :
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            {title}<span className="text-accent">.</span>
          </h2>
      }

      {description && (
        <p className={cn(
          "text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed",
          align === "center" && "mx-auto"
        )}>
          <LinkProcessor text={description} />
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;