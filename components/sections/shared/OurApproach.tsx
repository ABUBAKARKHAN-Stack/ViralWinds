"use client"
import { motion } from "motion/react";
import SectionHeading from "@/components/ui/section-heading";
import { ContainerLayout } from "@/components/layout";
import { useGlobalContent } from "@/context/GlobalContentContext";
import { getIconByName } from "@/lib/icon-mapper";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

const OurApproach = () => {
  const { globalContent } = useGlobalContent();

  const ourApproachData = globalContent?.ourApproach;
  const steps = ourApproachData?.steps || [];

  if (steps.length === 0) return null;

  return (
    <section className="lg:py-12.5 py-6.25 bg-muted/30">
      <ContainerLayout>
        <SectionHeading
          splitText
          eyebrow={ourApproachData?.sectionHeading?.eyebrow || "Our Approach"}
          title={ourApproachData?.sectionHeading?.title || "Strategy Before Design"}
          description={ourApproachData?.sectionHeading?.description || "Every successful project begins with a deep understanding of your business. We don't just create—we strategize."}
          align="center"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => {
            const IconComponent = getIconByName(step.iconName);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-background border border-border/50 rounded-2xl p-6 md:p-8 h-full hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                  <span className="text-6xl md:text-7xl font-display font-bold text-muted/20 absolute top-4 right-4 group-hover:text-accent/20 transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>

                  <h3 className="text-xl font-display font-semibold mb-3">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <LinkProcessor text={step.description} />
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ContainerLayout>
    </section>
  );
};

export default OurApproach;
