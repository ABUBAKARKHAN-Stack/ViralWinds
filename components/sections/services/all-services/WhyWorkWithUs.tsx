"use client"
import { ContainerLayout } from "@/components/layout";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { getIconByName } from "@/lib/icon-mapper";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

type WhyWorkWithUsProps = {
  sectionHeading: {
    eyebrow: string
    title: string
    description: string
  }
  guaranteePoints: string[]
  benefits: Array<{
    title: string
    description: string
    iconName: string
  }>
}

const WhyWorkWithUs = ({ sectionHeading, guaranteePoints, benefits }: WhyWorkWithUsProps) => {
  return (
    <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

      <ContainerLayout>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              {sectionHeading.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              {sectionHeading.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              <LinkProcessor text={sectionHeading.description} />
            </p>

            <div className="space-y-4">
              {guaranteePoints.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Benefits cards */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => {
              const Icon = getIconByName(benefit.iconName);
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card border border-border/50 rounded-2xl p-6 hover:border-accent/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        <LinkProcessor text={benefit.description} />
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </ContainerLayout>
    </section>
  );
};

export default WhyWorkWithUs