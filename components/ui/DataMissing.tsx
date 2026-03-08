"use client"

import { motion } from "motion/react"
import { LayoutPanelTop, Settings, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DataMissingProps {
    title?: string
    description?: string
    type?: "page" | "section" | "settings"
}

export const DataMissing = ({
    title = "Content Pending Configuration",
    description = "This page is currently being prepared by our team. Please check back shortly or explore our other sections.",
    type = "page"
}: DataMissingProps) => {
    return (
        <div className="relative flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-12">
            {/* Decorative background */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[80px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center text-center max-w-lg"
            >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-sm ring-1 ring-accent/20">
                    {type === "settings" ? (
                        <Settings className="h-8 w-8 animate-spin-slow" />
                    ) : (
                        <LayoutPanelTop className="h-8 w-8" />
                    )}
                </div>

                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {title}
                </h2>

                <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
                    {description}
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        asChild
                        size="lg"
                        className="h-12 min-w-[160px] rounded-full gap-2 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
                    >
                        <Link href="/">
                            Return Home
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="h-12 min-w-[160px] rounded-full gap-2 text-base font-medium transition-all hover:bg-accent/5"
                    >
                        <Link href="/services">
                            Our Services
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
