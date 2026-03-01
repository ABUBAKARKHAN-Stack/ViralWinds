"use client"

import { motion } from "motion/react";
import { ArrowUpRight, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import { ContainerLayout } from "@/components/layout";
import { CaseStudy, SectionHeadingType } from "@/types/services.types";
import { LinkProcessor } from "@/components/ui/LinkProcessor";


interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
  caseStudiesSectionHeader: SectionHeadingType
}

const CaseStudiesSection = ({ caseStudies, caseStudiesSectionHeader }: CaseStudiesSectionProps) => {
  return (
    <section className="lg:py-12.5 py-6.25 bg-muted/30 relative overflow-hidden">

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

      <ContainerLayout className="relative">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-6 uppercase">
            {caseStudiesSectionHeader.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            {caseStudiesSectionHeader.title}<span className="text-accent">.</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
            <LinkProcessor text={caseStudiesSectionHeader.description} />
          </p>
        </motion.div>



        <div className="space-y-8 max-w-5xl mx-auto">
          {caseStudies.map((caseStudy, index) => (
            <motion.div
              key={`${index}-${caseStudy.title}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 md:p-10 bg-background border border-border/50 hover:border-accent/50 transition-all duration-500 overflow-hidden">
                {/* Case number watermark */}
                <span className="absolute right-6 top-4 text-7xl md:text-8xl font-display font-bold text-muted/10 leading-none pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Title */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold group-hover:text-accent transition-colors">
                    {caseStudy.title}
                  </h3>
                </div>

                {/* PSR Grid */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                  {/* Problem */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium uppercase tracking-wider">Problem</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      <LinkProcessor text={caseStudy.problem} />
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Lightbulb className="w-5 h-5" />
                      <span className="text-sm font-medium uppercase tracking-wider">Solution</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      <LinkProcessor text={caseStudy.solution} />
                    </p>
                  </div>

                  {/* Result */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm font-medium uppercase tracking-wider">Result</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      <LinkProcessor text={caseStudy.result} />
                    </p>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-red-400 via-amber-400 to-emerald-400 group-hover:w-full transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </ContainerLayout>

    </section>
  );
};

export default CaseStudiesSection;
