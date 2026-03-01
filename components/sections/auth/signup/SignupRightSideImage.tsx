"use client"

import Logo from "@/components/ui/logo"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"

const SignupRightSideImage = () => {
    return (
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">

            {/* Background Image */}
            <Image
                src="/assets/auth/signup-bg.jpg"
                fill
                alt="Agency workspace"
                className="object-cover"
                priority
            />

            {/* Primary Dark Wash */}
            <div className="absolute inset-0 bg-background/60" />

            {/* Accent Gradient Layer */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-accent/20" />

            {/* Content */}
            <div className="absolute inset-0 p-12 flex flex-col">

                {/* Logo */}
                <Link href="/" className="self-start z-10">
                    <Logo className="h-10 " />
                </Link>

                {/* Center Content */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col justify-center h-full z-10"
                >
                    <span className="text-accent font-medium text-sm tracking-widest uppercase mb-3">
                        Admin Access Only
                    </span>

                    <h2 className="text-4xl font-display font-bold text-foreground-foreground leading-tight drop-shadow-sm">
                        Admin Access
                        <br />
                        Starts Here
                    </h2>

                    <p className="mt-4 text-foreground-foreground/80 text-lg max-w-md">
                        Create an administrator account to lanuch secure dashboard.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default SignupRightSideImage
