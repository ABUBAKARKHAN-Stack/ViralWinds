"use client"

import { ContainerLayout } from "@/components/layout"
import AnimatedBadge from "@/components/ui/animated-badge"
import { Sparkles, Send } from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { LinkProcessor } from "@/components/ui/LinkProcessor"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ContactFormType, contactSchema } from "@/schemas/contact.schema"
import { submitContactForm } from "@/app/actions/submitContactForm"
import { successToast, errorToast } from "@/lib/toastNotifications"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import MagneticButton from "@/components/MagneticButton"
import { cn } from "@/lib/utils"

interface PageCTAProps {
    cta?: {
        sectionHeading?: {
            eyebrow?: string
            title?: string
            description?: string
        }
    }
}

export default function PageCTA({ cta }: PageCTAProps) {
    const ctaRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ctaRef,
        offset: ["start end", "end start"],
    })

    const ctaY = useTransform(scrollYProgress, [0, 1], [100, -50])
    const ctaOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

    const form = useForm<ContactFormType>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: ""
        }
    })

    const { isSubmitting } = form.formState

    const onSubmit = async (data: ContactFormType) => {
        try {
            const result = await submitContactForm(data)

            if (result.success) {
                successToast(result.message)
                form.reset()
            } else {
                errorToast(result.message)
            }
        } catch (error) {
            console.error(error)
            errorToast('An unexpected error occurred. Please try again.')
        }
    }

    const fieldBaseClass = "bg-foreground/5! border-foreground/10! text-foreground/80! placeholder:text-foreground/40! focus:border-accent! h-12 rounded-xl"

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
                        {cta?.sectionHeading?.eyebrow && (
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
                                {cta?.sectionHeading?.title && (
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

                                {cta?.sectionHeading?.description && (
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
                                className="bg-foreground/5 backdrop-blur-md border border-primary-foreground/10 rounded-3xl p-6 md:p-8"
                            >
                                <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                                        <Send className="w-5 h-5 text-accent-foreground" />
                                    </span>
                                    Send Us Message
                                </h3>

                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FieldGroup>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <Controller
                                                name="name"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="name">Name *</FieldLabel>
                                                        <Input
                                                            {...field}
                                                            id="name"
                                                            placeholder="Enter your name"
                                                            className={fieldBaseClass}
                                                            autoComplete="off"
                                                        />
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                name="email"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="email">Email *</FieldLabel>
                                                        <Input
                                                            {...field}
                                                            id="email"
                                                            placeholder="Enter your email"
                                                            className={fieldBaseClass}
                                                            autoComplete="off"
                                                        />
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                    </Field>
                                                )}
                                            />
                                        </div>

                                        <Controller
                                            name="phone"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="phone">Phone *</FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="phone"
                                                        placeholder="Enter your phone number"
                                                        className={fieldBaseClass}
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name="message"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="message">Message *</FieldLabel>
                                                    <Textarea
                                                        {...field}
                                                        id="message"
                                                        placeholder="Tell us about your project..."
                                                        className={cn(fieldBaseClass, "resize-none h-32")}
                                                    />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                    </FieldGroup>

                                    <MagneticButton strength={0.05} className="w-full">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl font-semibold text-sm group"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <Spinner className="size-4.5!" />
                                            ) : (
                                                <>
                                                    {"Start Your Project"}
                                                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </MagneticButton>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </ContainerLayout>
        </motion.div>
    )
}
