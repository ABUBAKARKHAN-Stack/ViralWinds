"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle, ArrowLeft, ArrowRight, Lock, EyeOff, Eye } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { successToast, errorToast } from "@/lib/toastNotifications"
import Logo from "@/components/ui/logo"
import { resetPasswordSchema, ResetPasswordFormValues } from "@/schemas/auth.schema"

interface ResetPasswordFormProps {
    token: string
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)



    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const { isSubmitting } = form.formState

    const onSubmit = async (values: ResetPasswordFormValues) => {

        await authClient.resetPassword(
            {
                token,
                newPassword: values.password,
            },
            {
                onSuccess() {
                    successToast("Password reset successfully!")
                    setIsSubmitted(true)
                },
                onError(context) {
                    const errMsg =
                        context.error.message || "Failed to reset password."
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
                                Reset Password
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Enter your new password to regain access to your admin account
                            </p>
                        </div>

                        {/* Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Password
                                            </FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupAddon align="inline-start">
                                                        <Lock />
                                                    </InputGroupAddon>
                                                    <InputGroupInput
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    <InputGroupAddon align="inline-end">

                                                        <InputGroupButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className='rounded-full'
                                                            size={"icon-xs"}

                                                        >
                                                            {showPassword ? <EyeOff /> : <Eye />}
                                                        </InputGroupButton>
                                                    </InputGroupAddon>

                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupAddon align="inline-start">
                                                        <Lock />
                                                    </InputGroupAddon>
                                                    <InputGroupInput
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    <InputGroupAddon align="inline-end">

                                                        <InputGroupButton
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            size={"icon-xs"}
                                                            className='rounded-full'
                                                        >
                                                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                                                        </InputGroupButton>
                                                    </InputGroupAddon>

                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    variant="secondary"
                                    disabled={isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting ? (
                                        <>
                                            Resetting Password <Spinner />
                                        </>
                                    ) : (
                                        <>
                                            Reset Password <ArrowRight />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </>
                ) : (
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
                            Password Reset Successful
                        </h2>
                        <p className="text-muted-foreground text-sm mb-8">
                            You can now sign in with your new password
                        </p>
                        <Link href="/auth/signin" className="block">
                            <Button variant="secondary" className="w-full h-10">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign in
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default ResetPasswordForm
