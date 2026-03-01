"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

const ResetPasswordFallback = () => {
  return (
    <div className="h-full min-h-screen flex items-center justify-center p-6 sm:p-12 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Invalid or Missing Token
        </h2>

        <p className="text-muted-foreground text-sm mb-6">
          We couldn’t verify your password reset request. Please ensure you clicked the correct link from your email.
        </p>

        <Link href="/auth/signin">
          <Button variant="secondary" className="w-full h-10">
            Back to Sign In
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

export default ResetPasswordFallback
