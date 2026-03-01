"use client"
import { motion } from "motion/react";
import { Target, Layers, Sparkles } from "lucide-react";
import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { SectionHeadingType } from "@/types/services.types";

interface HowWeHelpSectionProps {
  points: { title: string; description: string }[];
  howWeHelpSectionHeader: SectionHeadingType

}

const icons = [Target, Layers, Sparkles];

const HowWeHelpSection = ({ points, howWeHelpSectionHeader }: HowWeHelpSectionProps) => {
  return (
    <section className="lg:py-12.5 py-6.25 bg-muted/30 relative overflow-hidden">

      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

      <ContainerLayout className="relative">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          {
            howWeHelpSectionHeader.eyebrow && <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-6 uppercase">
              {howWeHelpSectionHeader.eyebrow}
            </span>
          }
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            {howWeHelpSectionHeader.title}<span className="text-accent">.</span>
          </h2>
          {
            howWeHelpSectionHeader.description && <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
              <LinkProcessor text= {howWeHelpSectionHeader.description} />
            </p>
          }
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {points.map((point, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full p-8 bg-background border border-border/50 hover:border-accent/50 transition-all duration-500 overflow-hidden">

                  {/* Number watermark */}
                  <span className="absolute -right-4 -top-6 text-[100px] font-display font-bold dark:text-muted/20 text-muted/50 leading-none pointer-events-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="relative z-10 text-xl font-display font-bold mb-4 group-hover:text-accent transition-colors">
                    {point.title}
                  </h3>
                  <p className="relative z-10 text-muted-foreground leading-relaxed">
                    <LinkProcessor text={point.description} />
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </ContainerLayout>

    </section>
  );
};

export default HowWeHelpSection;
