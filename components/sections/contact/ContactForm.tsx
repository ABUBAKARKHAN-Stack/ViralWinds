import { motion } from "motion/react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormType, contactSchema } from "@/schemas/contact.schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ContactForm = ({ className = "" }) => {

    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            email: "",
            message: "",
            name: "",
            subject: ""
        }
    })

    const {
        isSubmitted,
        isLoading
    } = form.formState

    const onSubmit = (data: ContactFormType) => { }

    const fieldBaseClass = "border-0 border-b rounded-none px-1 py-0! focus-visible:ring-0 bg-transparent! transition-colors"

    return (
        <>

            {/* Contact Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.3 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, }}
            >
                <Card
                    className={cn(
                        "relative overflow-hidden",
                        className
                    )}
                >

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                        <FieldGroup>

                            <div className="grid md:grid-cols-2 gap-6">

                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="name">
                                                Name *
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter your name"
                                                className={fieldBaseClass}
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="email">
                                                Email *
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="email"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter your email"
                                                className={fieldBaseClass}
                                                autoComplete="off"


                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <Controller
                                name="subject"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="subject">
                                            Subject *
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="subject"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Project inquiry"
                                            className={fieldBaseClass}
                                            autoComplete="off"


                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="message"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="message">
                                            Message *
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            id="message"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Tell us about your project..."
                                            rows={5}
                                            className={cn(
                                                fieldBaseClass,
                                                "resize-none"
                                            )}
                                            autoComplete="off"


                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />


                            <Button
                                type="submit"
                                className="w-full md:w-auto px-12 bg-accent text-accent-foreground hover:bg-accent/90 group"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full mr-2"
                                        />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </FieldGroup>
                    </form>

                </Card>
            </motion.div>

        </>
    );
};

export default ContactForm;
