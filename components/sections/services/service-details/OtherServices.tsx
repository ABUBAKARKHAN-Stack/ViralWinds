"use client"
import { ContainerLayout } from "@/components/layout"
import { LinkProcessor } from "@/components/ui/LinkProcessor"
import { SectionHeadingType, ServiceLightWeight } from "@/types/services.types"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

interface OtherServicesProps {
    otherServices?: ServiceLightWeight[];
    otherServicesSectionHeader?: SectionHeadingType;
    otherServicesButtonText?: string;
    otherServicesButtonUrl?: string;
}

const OtherServices = ({
    otherServices,
    otherServicesSectionHeader,
    otherServicesButtonText,
    otherServicesButtonUrl
}: OtherServicesProps) => {

    if (!otherServices) return null;


    return (
        <section className="lg:py-12.5 py-6.25 bg-muted/30 relative">

            <ContainerLayout>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
                >
                    <div className="max-w-2xl">
                        <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-4 uppercase">{otherServicesSectionHeader?.eyebrow}</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">
                            {otherServicesSectionHeader?.title}
                        </h2>
                        {otherServicesSectionHeader?.description && (
                            <p className="text-muted-foreground mt-4 leading-relaxed">
                                <LinkProcessor text={otherServicesSectionHeader?.description} />
                            </p>
                        )}
                    </div>
                    {/* View All Link */}
                    {(otherServicesButtonText && otherServicesButtonUrl) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-center"
                        >
                            <Link href={otherServicesButtonUrl} className="inline-flex items-center gap-2 group">
                                <span className="text-sm tracking-widest group-hover:text-accent
                            transition-colors">
                                    {otherServicesButtonText}
                                </span>
                                <ArrowUpRight className="h-4 w-4 group-hover:text-accent transition-colors" />
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherServices.map((s, i) => {
                        const idx = i + 1
                        const serviceNumber = idx >= 10 ? idx.toString() : `0${idx}`

                        return (
                            <motion.div
                                key={`${i}-${s.slug}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={`/services/${s.slug}`}
                                    className="group block relative p-8 bg-background border border-border/50 hover:border-accent/50 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Watermark number */}
                                    <span className="absolute -right-4 -top-6 text-[120px] font-display font-bold dark:text-muted/20 text-muted/50 leading-none pointer-events-none">
                                        {serviceNumber}
                                    </span>

                                    <div className="relative z-10">
                                        <span className="text-accent text-xs tracking-widest font-medium">{serviceNumber}</span>
                                        <h3 className="text-2xl font-display font-bold mt-2 mb-3 group-hover:text-accent transition-colors">
                                            {s.title}
                                        </h3>
                                        <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed mb-6">
                                            <LinkProcessor text={s.description} />
                                        </p>
                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                            Learn More<ArrowUpRight className="h-4 w-4" />
                                        </span>
                                    </div>

                                    {/* Hover line */}
                                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-500" />
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>


            </ContainerLayout>

        </section>
    )
}

export default OtherServices
