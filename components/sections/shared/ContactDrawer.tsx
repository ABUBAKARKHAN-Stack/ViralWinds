"use client";

import { Activity, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { ServiceFormType, serviceSchema } from "@/schemas/contact.schema";
import { Spinner } from "@/components/ui/spinner";
import { submitContactForm } from "@/app/actions/submitContactForm";
import { errorToast, successToast } from "@/lib/toastNotifications";

interface ContactDrawerProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    service?: string;
}


const ContactDrawer = ({ open: propOpen, service, onOpenChange }: ContactDrawerProps) => {
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<ServiceFormType>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
            service: "",
            phone: ""
        },
    });

    useEffect(() => {
        if (service) {
            form.setValue("service", service);
        }
    }, [service]);

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: ServiceFormType) => {
        try {
            const result = await submitContactForm(data)
            if (result.success) {
                setSubmitted(true);
                successToast(result.message || "Message sent successfully")
                form.reset();
                setTimeout(() => {
                    onOpenChange?.(false);
                    setTimeout(() => setSubmitted(false), 300);
                }, 2000);
            }

            if (result.error) {
                const errMsg =
                    result.error ||
                    "We couldn't deliver your message at the moment. Please try again later.";

                errorToast(errMsg)
            }
        } catch (error) {
            const err = error as any;

            const errMsg =
                err?.message ||
                "Something went wrong while sending your message. Please try again.";

            errorToast(errMsg)
        }
    };


    return (
        <Sheet
            open={propOpen}
            onOpenChange={(v) => {
                if (!v) {
                    setTimeout(() => setSubmitted(false), 300);
                    form.reset();
                }
                onOpenChange?.(v);
            }}
        >
            <SheetContent
                side="right"
                className="custom-scrollbar bg-background border-border/50 w-full overflow-y-auto p-0 sm:max-w-md"
            >
                <div className="p-6 pb-0">
                    <SheetHeader className="mb-1 text-left">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="bg-accent h-2 w-2 animate-pulse rounded-full" />
                            <span className="text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
                                Quick Contact
                            </span>
                        </div>
                        <SheetTitle className="text-foreground font-playfair text-2xl font-bold">
                            Let's <span className="text-accent italic">talk</span>
                        </SheetTitle>
                        <SheetDescription className="text-muted-foreground text-sm font-light">
                            Fill out the form below and we'll get back to you within 24 hours.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div
                            key="success"
                            className="flex min-h-[60vh] flex-col items-center justify-center p-10 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="bg-accent/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                <Send className="text-accent h-7 w-7" />
                            </div>
                            <h3 className="text-foreground mb-2 text-xl font-bold">
                                Message Sent!
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                We'll be in touch soon.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            className="p-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-5"
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                                                        Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Your name"
                                                            className="bg-muted/30 border-border/50 focus:border-accent h-11 rounded-xl text-sm transition-colors"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            className="bg-muted/30 border-border/50 focus:border-accent h-11 rounded-xl text-sm transition-colors"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                                        <FormField
                                            control={form.control}
                                            name="service"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                                                        Service Interested In
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="How can we help?"
                                                            className="bg-muted/30 border-border/50 focus:border-accent h-11 rounded-xl text-sm transition-colors"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                                                        Phone
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="How can we help?"
                                                            className="bg-muted/30 border-border/50 focus:border-accent h-11 rounded-xl text-sm transition-colors"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />

                                    </div>



                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                                                    Message
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell us about your project..."
                                                        rows={4}
                                                        className="bg-muted/30 border-border/50 focus:border-accent resize-none rounded-xl text-sm transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        size="lg"
                                        className="bg-foreground text-background hover:bg-foreground/90 h-12 w-full rounded-full text-sm font-medium"
                                    >
                                        {/* Rest State  */}
                                        <Activity mode={!isSubmitting ? "visible" : "hidden"}>
                                            <Send /> Send Message
                                        </Activity>

                                        {/* Loader State  */}
                                        <Activity mode={isSubmitting ? "visible" : "hidden"}>
                                            <Spinner data-icon="inline-start" />
                                            Sending Message
                                        </Activity>
                                    </Button>
                                </form>
                            </Form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </SheetContent>
        </Sheet>
    );
};

export default ContactDrawer;
