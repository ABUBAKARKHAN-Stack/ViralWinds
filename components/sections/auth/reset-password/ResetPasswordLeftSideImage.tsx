"use client"

import Logo from "@/components/ui/logo"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"

const ResetPasswordLeftSideImage = () => {
    return (
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">

            {/* Background Image */}
            <Image
                src="/assets/auth/forgot-bg.jpg"
                alt="Security & Recovery"
                fill
                className="object-cover"
                priority
            />
            
            {/* Primary Dark Wash */}
            <div className="absolute inset-0 bg-background/60" />

            {/* Accent Gradient Layer */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-accent/20" />


            {/* Content Overlay */}
            <div className="absolute inset-0 p-12 flex flex-col">

                {/* Logo */}
                <Link href="/" className="self-start z-10">
                    <Logo className="h-10 " />
                </Link>

                {/* Center Text */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col justify-center h-full z-10"
                >
                    <span className="text-accent text-sm tracking-widest uppercase mb-3">
                        Account Recovery
                    </span>

                    <h2 className="text-4xl font-display font-bold text-foreground-foreground leading-tight drop-shadow-sm">
                        Reset Your Password
                    </h2>

                    <p className="mt-4 text-foreground-foreground/80 text-lg max-w-md">
                        Enter a new password to secure your administrator account. Once done, you’ll be able to sign in safely.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default ResetPasswordLeftSideImage
