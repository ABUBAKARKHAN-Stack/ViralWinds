"use client"
import { motion } from "motion/react";
import { Building2, ShoppingBag, Briefcase, Stethoscope, Plane, Code } from "lucide-react";
import { ContainerLayout } from "@/components/layout";
import { SectionHeadingType } from "@/types/services.types";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

interface Industry {
  name: string;
  description: string;
}

interface IndustriesSectionProps {
  industries: Industry[];
  industriesSectionHeader:SectionHeadingType
}

const industryIcons = [Building2, ShoppingBag, Briefcase, Stethoscope, Plane, Code];

const IndustriesSection = ({ industries,industriesSectionHeader }: IndustriesSectionProps) => {
  return (
    <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <ContainerLayout className="relative">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-6 uppercase">
           {industriesSectionHeader.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            {industriesSectionHeader.title}<span className="text-accent">.</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
          <LinkProcessor text={ industriesSectionHeader.description} />
          </p>
        </motion.div>

     
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => {
            const Icon = industryIcons[index % industryIcons.length];
            return (
              <motion.div
                key={`${index}-${industry.name}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative p-6 bg-background/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-500 rounded-lg"
              >
                {/* Icon container */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold mb-2 group-hover:text-accent transition-colors">
                      {industry.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <LinkProcessor text={industry.description} />
                    </p>
                  </div>
                </div>
                
                {/* Corner decoration */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-linear-to-tl from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-3xl" />
              </motion.div>
            );
          })}
        </div>
      </ContainerLayout>
    </section>
  );
};

export default IndustriesSection;
