"use client"

import { motion } from "motion/react";
import { Check, Award, Users, Clock, Shield } from "lucide-react";
import { ContainerLayout } from "@/components/layout";
import { SectionHeadingType } from "@/types/services.types";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

interface ServiceBenefitsProps {
  benifitsSectionHeading: SectionHeadingType;
  benefits: string[];
  whyChooseUsSectionHeading: SectionHeadingType;
  whyChooseUsPoints: { title: string; description: string }[];
}

const icons = [Award, Users, Clock, Shield];

const ServiceBenefitsSection = ({
  benefits,
  benifitsSectionHeading,
  whyChooseUsPoints,
  whyChooseUsSectionHeading
}: ServiceBenefitsProps) => {
  return (
    <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-150 h-150 bg-accent/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      </div>

      <ContainerLayout className="relative">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-6 uppercase">
              {benifitsSectionHeading.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-10">
              {benifitsSectionHeading.title}<span className="text-accent">.</span>
            </h2>
            <p className="text-lg text-muted-foreground my-6 max-w-2xl mx-auto">
              <LinkProcessor text={benifitsSectionHeading.description} />
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group flex items-center gap-4 p-4 bg-muted/30 hover:bg-muted/50 border border-border/50 hover:border-accent/30 transition-all duration-300 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Check className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-foreground font-medium group-hover:text-accent transition-colors">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Us Points */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-6 uppercase">
              {whyChooseUsSectionHeading.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-10">
              {whyChooseUsSectionHeading.title}<span className="text-accent">.</span>
            </h2>
            <p className="text-lg text-muted-foreground my-6 max-w-2xl mx-auto">
              <LinkProcessor text={whyChooseUsSectionHeading.description} />
            </p>


            <div className="space-y-6">
              {whyChooseUsPoints.map((point, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="group"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-bold mb-2 group-hover:text-accent transition-colors">
                          {point.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          <LinkProcessor text={point.description} />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </ContainerLayout>
    </section>
  );
};

export default ServiceBenefitsSection;
