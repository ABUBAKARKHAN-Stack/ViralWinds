"use client"

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import Logo from '@/components/ui/logo';
import { authClient } from '@/lib/auth-client';
import { SignUpFormValues, signUpSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { errorToast, successToast } from '@/lib/toastNotifications';
import { Spinner } from '@/components/ui/spinner';
import { Roles } from '@/types/auth.types';

const Signupform = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {
        isSubmitting
    } = form.formState

    //! Will fix permissions later when use
    const onSubmit = async (formValues: SignUpFormValues) => {
        await authClient.signUp.email({
            email: formValues.email,
            password: formValues.password,
            name: formValues.fullName,
            role: Roles.ADMIN,
            permissions: {},
            callbackURL: "/admin/dashboard"
        }, {
            onSuccess(_context) {
                successToast("Account Created Successfully!")
            },
            onError(context) {
                const errMsg = context.error.message || "Failed To Create An Account."
                errorToast(errMsg)
            },
        })
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm"
            >
                {/* Mobile Logo */}
                <Link href="/" className="inline-block mb-8 lg:hidden">
                    <Logo className="h-8" />
                </Link>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-display font-bold text-foreground mb-1">
                        Create Admin Account
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Sign up to access and manage your agency dashboard
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <InputGroup>
                                            <InputGroupAddon align="inline-start">
                                                <User />
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                placeholder="Your Full Name"
                                                {...field}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Email
                                    </FormLabel>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                            variant={"secondary"}
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {
                                isSubmitting ? <>
                                    Creating account <Spinner />
                                </> : <> Create account  <ArrowRight /></>
                            }

                        </Button>
                    </form>
                </Form>

                {/* Sign In Link */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-accent hover:text-accent/80 font-medium transition-colors hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>

    )
}

export default Signupform