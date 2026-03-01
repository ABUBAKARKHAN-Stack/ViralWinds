"use client"

import { motion } from "motion/react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ContainerLayout } from "@/components/layout";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import { SectionHeadingType } from "@/types/services.types";

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs: FAQ[];
    faqsSectionHeader: SectionHeadingType


}

const FAQSection = ({ faqs, faqsSectionHeader }: FAQSectionProps) => {
    return (
        <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-125 h-125 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
            </div>

            <ContainerLayout className="relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center mb-16"
                >
                    <span className="inline-block text-accent text-xs tracking-[0.3em] font-medium mb-6 uppercase">
                        {faqsSectionHeader.eyebrow}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                        {faqsSectionHeader.title}<span className="text-accent">.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
                        <LinkProcessor text={faqsSectionHeader.description} />
                    </p>
                </motion.div>



                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto"
                >
                    <Accordion type="single" defaultValue="item-0" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="group border border-border/50 bg-background/50 backdrop-blur-sm hover:border-accent/30 transition-colors px-6 rounded-lg overflow-hidden"
                            >
                                <AccordionTrigger className="text-left py-6 hover:no-underline">
                                    <div className="flex items-start gap-4">
                                        <span className="text-accent font-display font-bold text-sm mt-0.5">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-lg font-display font-medium group-hover:text-accent transition-colors">
                                            {faq.question}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6">
                                    <p className="text-muted-foreground leading-relaxed">
                                        <LinkProcessor text={faq.answer} />
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </ContainerLayout>

        </section>
    );
};

export default FAQSection;
