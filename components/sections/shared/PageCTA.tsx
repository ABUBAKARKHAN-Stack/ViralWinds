"use client"

import { ContainerLayout } from "@/components/layout"
import AnimatedBadge from "@/components/ui/animated-badge"
import { Sparkles } from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import DynamicForm from "./DynamicForm"
import { LinkProcessor } from "@/components/ui/LinkProcessor"

interface PageCTAProps {
    cta: {
        sectionHeading?: {
            eyebrow?: string
            title?: string
            description?: string
        }
        form?: any
    }
}

export default function PageCTA({ cta }: PageCTAProps) {
  

    if (!cta || !cta.form) return null

      const ctaRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ctaRef,
        offset: ["start end", "end start"],
    })

    const ctaY = useTransform(scrollYProgress, [0, 1], [100, -50])
    const ctaOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
    return (
        <motion.div
            ref={ctaRef}
            style={{ y: ctaY, opacity: ctaOpacity }}
            className="lg:py-12.5 py-6.25"
        >
            <ContainerLayout className="relative">
                <div className="relative bg-linear-to-br from-card via-card to-muted/30 border border-border/50 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute top-8 right-12 text-accent/30"
                    >
                        <Sparkles className="w-8 h-8" />
                    </motion.div>

                    <div className="relative z-10">
                        {cta.sectionHeading?.eyebrow && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <AnimatedBadge className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-8">
                                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    <span className="text-accent text-sm font-medium tracking-wide">{cta.sectionHeading.eyebrow}</span>
                                </AnimatedBadge>
                            </motion.div>
                        )}

                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                            <div className="space-y-6">
                                {cta.sectionHeading?.title && (
                                    <motion.h2
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 }}
                                        className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-none"
                                    >
                                        {(() => {
                                            const words = cta.sectionHeading.title.split(" ")
                                            const lastWord = words.pop()
                                            const rest = words.join(" ")
                                            return (
                                                <>
                                                    {rest} <span className="text-accent">{lastWord}</span>
                                                </>
                                            )
                                        })()}
                                    </motion.h2>
                                )}

                                {cta.sectionHeading?.description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="text-muted-foreground text-lg md:text-xl leading-relaxed"
                                    >
                                        <LinkProcessor text={cta.sectionHeading.description} />
                                    </motion.p>
                                )}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                <DynamicForm
                                    formId={cta.form._id}
                                    formName={cta.form.name}
                                    fields={cta.form.fields}
                                    submitButtonText={cta.form.submitButtonText}
                                    successMessage={cta.form.successMessage}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </ContainerLayout>
        </motion.div>
    )
}
