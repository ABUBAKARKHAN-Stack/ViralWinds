"use client"

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import {  useSession } from "@/context/SessionContext";
import { Roles } from "@/types/auth.types";
import { roleLabels } from "@/constants/admin.constants";



export function DashboardWelcome() {

    const { session } = useSession()
    const roleLabel = roleLabels[session.user.role as Roles]

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
        >
            {/* Subtle gradient background */}
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/5 via-transparent to-transparent rounded-2xl blur-3xl" />

            <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <motion.h1
                        className="text-3xl sm:text-4xl font-bold tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Welcome back,{" "}
                        <span className="gradient-text">{session.user.name}</span>!
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3, type: "spring", stiffness: 400 }}
                    >
                        <Badge
                            variant="secondary"
                            className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-0 hover:bg-primary/15 transition-colors"
                        >
                            <Sparkles className="h-3 w-3 mr-1.5" />
                            {roleLabel}
                        </Badge>
                    </motion.div>
                </div>
                <motion.p
                    className="text-muted-foreground max-w-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Manage your website content with role-based access control.
                </motion.p>
            </div>
        </motion.div>
    );
}
