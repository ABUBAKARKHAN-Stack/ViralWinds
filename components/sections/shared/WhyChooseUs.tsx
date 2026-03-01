"use client"

import { motion } from "framer-motion";
import SplitText from "@/components/ui/split-text";
import { ContainerLayout } from "@/components/layout";
import SectionHeading from "@/components/ui/section-heading";
import { useGlobalContent } from "@/context/GlobalContentContext";
import { getIconByName } from "@/lib/icon-mapper";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

const WhyChooseUs = () => {
  const { globalContent } = useGlobalContent();

  const whyChooseUsData = globalContent?.whyChooseUs;
  const benefits = whyChooseUsData?.benefits || [];

  if (benefits.length === 0) return null;
  return (
    <section className="lg:py-12.5 py-6.25 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

      <ContainerLayout className="relative">

        <SectionHeading
          splitText
          align="center"
          title={whyChooseUsData?.sectionHeading?.title || "Why choose Mohsin Designs"}
          eyebrow={whyChooseUsData?.sectionHeading?.eyebrow || "why us"}
          description={whyChooseUsData?.sectionHeading?.description || "Choosing the right creative agency is about finding a partner who understands your business,respects your vision, and knows how to translate ideas into results."}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = getIconByName(benefit.iconName);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-8 rounded-sm border border-border bg-card hover:border-accent/50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm" />

                <div className="relative">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-6 h-6 text-accent" />
                  </motion.div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    <LinkProcessor text={benefit.description} />
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

export default WhyChooseUs;
