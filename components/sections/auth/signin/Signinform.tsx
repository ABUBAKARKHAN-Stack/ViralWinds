"use client"
import { SignInFormValues, signInSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react'
import { motion } from 'motion/react';
import Link from 'next/link';
import Logo from '@/components/ui/logo';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { errorToast, successToast } from '@/lib/toastNotifications';

const Signinform = () => {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const {
        isSubmitting
    } = form.formState

    const onSubmit = async (formValues: SignInFormValues) => {
        await authClient.signIn.email({
            email: formValues.email,
            password: formValues.password,
            rememberMe: formValues.rememberMe,
            callbackURL: "/admin/dashboard"
        }, {
            onSuccess(_context) {
                successToast("Login Successful!")
            },
            onError(context) {
                const errMsg = context.error.message || "Failed To Login."
                errorToast(errMsg)
            },
        })
    };
    

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
                    <Logo className='h-8' />
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-display font-bold text-foreground mb-1">
                        Welcome back
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Sign in to your account to continue
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

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</FormLabel>
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
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between pt-1">
                            <FormField
                                control={form.control}
                                name="rememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex items-center ">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-xs text-muted-foreground cursor-pointer">
                                            Remember me
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs text-accent hover:text-accent/80 transition-colors hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant={"secondary"}
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {
                                isSubmitting ?
                                    <>
                                        Signing in <Spinner />
                                    </>
                                    : <>
                                        Sign in <ArrowRight />
                                    </>
                            }
                        </Button>
                    </form>
                </Form>

            </motion.div>
        </div>
    )
}

export default Signinform