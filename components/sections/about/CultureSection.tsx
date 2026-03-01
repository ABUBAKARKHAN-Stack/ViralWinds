"use client"

import SectionHeading from "@/components/ui/section-heading";
import { useAboutPageContent } from "@/context/AboutPageContentContext";
import { motion } from 'motion/react'
import { getIconByName } from "@/lib/icon-mapper";
import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

export const CultureSection = () => {
    const { aboutPageContent } = useAboutPageContent();
    const cultureData = aboutPageContent?.culture;

    return (
        <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

            <ContainerLayout>

                <SectionHeading
                    eyebrow={cultureData?.sectionHeading?.eyebrow || "Our Values"}
                    title={cultureData?.sectionHeading?.title || "Culture & Values"}
                    description={cultureData?.sectionHeading?.description || "Our culture is built around responsibility, growth, and respect."}
                    align="center"
                />

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {(cultureData?.values && cultureData.values.length > 0 ? cultureData.values : [
                        { iconName: "MessageSquare", title: "Clear Communication", description: "We believe transparency creates trust. Direct, honest, and timely communication in every interaction." },
                        { iconName: "Award", title: "Quality First", description: "Good work should last beyond trends. We prioritize craftsmanship and attention to detail." },
                        { iconName: "HeartHandshake", title: "Respect & Partnership", description: "We respect our clients' businesses as if they were our own. Long-term relationships over transactions." },
                    ]).map((value, index) => {
                        const Icon = getIconByName(value.iconName);
                        return (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:scale-105 transition-all duration-300">
                                    <Icon className="w-10 h-10 text-accent group-hover:text-accent-foreground transition-colors" />
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    <LinkProcessor
                                        text={value.description}
                                    />
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <blockquote className="text-2xl md:text-3xl font-display italic text-muted-foreground max-w-3xl mx-auto">
                        {<>"<LinkProcessor text={cultureData?.quote} /></> || (
                            <>"Most importantly, we respect our clients' businesses <span className="text-accent not-italic font-bold">as if they were our own.</span>"</>
                        )}
                        {cultureData?.quoteHighlight && (
                            <span className="text-accent not-italic font-bold">
                                <LinkProcessor text={cultureData?.quoteHighlight} />
                                "</span>
                        )}
                    </blockquote>
                </motion.div>
            </ContainerLayout>
        </section>
    );
};
