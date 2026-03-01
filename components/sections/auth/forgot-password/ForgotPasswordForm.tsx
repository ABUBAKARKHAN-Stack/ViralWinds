"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import Logo from "@/components/ui/logo"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, CheckCircle, Mail } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

const ForgotPasswordForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const {
        isSubmitting
    } = form.formState


    const onSubmit = async (formValues: ForgotPasswordFormValues) => {
        await authClient.requestPasswordReset(
            {
                 email: formValues.email,
                 redirectTo: "/auth/reset-password"
                 },
            {
                onSuccess() {
                    successToast("If this email exists in our system, check your email for the reset link.")
                    setSubmittedEmail(formValues.email);
                    setIsSubmitted(true);
                    form.reset()
                },
                onError(context) {
                    const errMsg =
                        context.error.message || "Unable to send password reset link."
                    errorToast(errMsg)
                },
            }
        )

    }


    return (
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm"
            >
                {/* Mobile Logo */}
                <Link href="/" className="inline-block mb-8 lg:hidden">
                    <Logo className="h-8" />
                </Link>

                {!isSubmitted ? (
                    <>
                        {/* Back Link */}
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to sign in
                        </Link>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-display font-bold text-foreground mb-1">
                                Forgot password?
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                No worries, we'll send you reset instructions.
                            </p>
                        </div>

                        {/* Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupAddon align="inline-start">
                                                        <Mail />
                                                    </InputGroupAddon>
                                                    <InputGroupInput
                                                        type='email'
                                                        placeholder="you@example.com"
                                                        {...field}
                                                    />
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    variant={"secondary"}
                                    disabled={isSubmitting}
                                    className="w-full"
                                >

                                    {
                                        isSubmitting ?
                                            <>
                                                Resetting Password <Spinner />
                                            </>
                                            :
                                            <>
                                                Reset password <ArrowRight />
                                            </>
                                    }
                                </Button>
                            </form>
                        </Form>

                       
                    </>
                ) : (
                    /* Success State */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                            Check your email
                        </h2>
                        <p className="text-muted-foreground text-sm mb-1">
                            We've sent a password reset link to
                        </p>
                        <p className="text-foreground font-medium text-sm mb-8">
                            {submittedEmail}
                        </p>

                        <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Didn't receive the email?</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Check your spam folder</li>
                                <li>• Make sure you entered the correct email</li>
                                <li>• Wait a few minutes and try again</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => setIsSubmitted(false)}
                                variant="outline"
                                className="w-full h-10"
                            >
                                Try different email
                            </Button>
                            <Link href="/auth/signin" className="block">
                                <Button
                                    variant="ghost"
                                    className="w-full h-10"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to sign in
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default ForgotPasswordForm