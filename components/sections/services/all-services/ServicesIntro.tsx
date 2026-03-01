"use client"
import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

type ServicesIntroProps = {
  badgeText: string
  heading: string
  headingAccent: string
  description: string
}

const ServicesIntro = ({ badgeText, heading, headingAccent, description }: ServicesIntroProps) => {
  return (
    <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-75 h-75 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <ContainerLayout className="relative">
        <div className="max-w-5xl mx-auto">

          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-r from-accent/20 via-accent/30 to-accent/20 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-accent/30 rounded-full px-6 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                  <span className="w-1 h-1 rounded-full bg-accent/30" />
                </div>
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">
                  {badgeText}
                </span>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] tracking-tight">
              {heading}
              <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-linear-to-r from-accent via-accent to-accent/80 bg-clip-text text-transparent">
                  {headingAccent}
                </span>
                {/* Underline accent */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 8 Q75 2, 150 8 Q225 14, 298 6"
                    stroke="hsl(var(--accent))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  />
                </motion.svg>
              </span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl lg:text-2xl leading-relaxed text-center max-w-3xl mx-auto mb-12"
          >
            <LinkProcessor
              text={description}
            />
          </motion.p>

        </div>
      </ContainerLayout>

    </section>
  );
};

export default ServicesIntro