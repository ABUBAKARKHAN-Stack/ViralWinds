"use client"
import { ContainerLayout } from "@/components/layout"
import { SectionHeadingType } from "@/types/services.types"
import { LinkProcessor } from "@/components/ui/LinkProcessor"
import { motion } from "motion/react"

type Props = {
    serviceOverviewSectionHeader: SectionHeadingType;
    features: string[]
}
const ServiceOverview = ({
    features,
    serviceOverviewSectionHeader
}: Props) => {
    return (
        <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

            {/* Background accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-accent/5 to-transparent pointer-events-none" />

            <ContainerLayout className="relative">

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 lg:sticky lg:top-32"
                    >
                        <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-6 uppercase">{serviceOverviewSectionHeader.eyebrow}</span>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter leading-[0.9]">
                            {serviceOverviewSectionHeader.title}
                        </h2>
                        <div className="w-20 h-1 bg-accent mt-8" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-light">
                            <LinkProcessor text={serviceOverviewSectionHeader.description} />
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {features.map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.08 }}
                                    className="group relative p-5 bg-background border border-border/50 hover:border-accent transition-all duration-300"
                                >
                                    <div className="absolute top-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500" />
                                    <span className="text-sm font-medium group-hover:text-accent transition-colors">
                                        {item}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </ContainerLayout>
        </section>

    )
}

export default ServiceOverview