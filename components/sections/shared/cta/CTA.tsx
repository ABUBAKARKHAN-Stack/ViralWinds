"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";
import MagneticButton from "@/components/MagneticButton";
import { ContainerLayout } from "@/components/layout";
import { Controller, useForm } from "react-hook-form";
import { ContactFormType } from "@/schemas/contact.schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import DecorativeElements from "./DecorativeElements";
import AnimatedBadge from "@/components/ui/animated-badge";
import { Spinner } from "@/components/ui/spinner";
import { useGlobalContent } from "@/context/GlobalContentContext";
import { submitContactForm } from "@/app/actions/submitContactForm";
import { getForm, submitDynamicForm } from "@/app/actions/formActions";
import { successToast, errorToast } from "@/lib/toastNotifications";
import { useState, useEffect } from "react";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

const CTA = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const { globalContent } = useGlobalContent();
  const ctaData = globalContent?.cta;
  const [dynamicForm, setDynamicForm] = useState<any>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  // Fetch dynamic form if formId is provided
  useEffect(() => {
    async function fetchForm() {
      if (ctaData?.formId) {
        setIsLoadingForm(true);
        try {
          const result = await getForm(ctaData.formId);
          if (result.success && result.data) {
            setDynamicForm(result.data);
          }
        } catch (error) {
          console.error("Failed to load form:", error);
        } finally {
          setIsLoadingForm(false);
        }
      } else {
        setDynamicForm(null);
      }
    }
    fetchForm();
  }, [ctaData?.formId]);

  const form = useForm({
    // Dynamic fields handle their own validation via rules in Controller
  })

  // Initialize form defaults when dynamicForm is loaded or cleared
  useEffect(() => {
    if (dynamicForm) {
      const defaults: Record<string, any> = {};
      dynamicForm.fields.forEach((f: any) => {
        defaults[f.fieldName] = "";
      });
      form.reset(defaults);
    } else {
      form.reset({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }
  }, [dynamicForm, form]);

  const {
    isSubmitting,
  } = form.formState

  const onSubmit = async (data: any) => {
    try {
      if (dynamicForm) {
        const result = await submitDynamicForm(dynamicForm._id, data);

        if (result.success) {
          successToast(result.message || "Form submitted successfully!");
          form.reset();
        } else {
          errorToast(result.error || "Failed to submit form");
        }
      } else {
        // Use default contact form submission
        const result = await submitContactForm(data as ContactFormType);

        if (result.success) {
          successToast(result.message);
          form.reset();
        } else {
          errorToast(result.message);
        }
      }
    } catch (error) {
      errorToast('An unexpected error occurred. Please try again.');
    }
  }

  const fieldBaseClass = "bg-foreground/5! border-foreground/10! text-foreground/80! placeholder:text-foreground/40! focus:border-accent! h-12 rounded-xl"

  if (!ctaData) return null;

  return (
    <section ref={containerRef} className="lg:py-12.5 py-6.25 bg-background relative overflow-hidden">

      <DecorativeElements
        scrollYProgress={scrollYProgress}
        y={y}
      />

      <ContainerLayout className=" relative z-50">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >

            <AnimatedBadge className="inline-flex gap-2 px-5 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-foreground/80 animate-pulse" />
              <span className="text-sm font-medium text-foreground/80">{ctaData.badge}</span>
            </AnimatedBadge>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-tight mb-6">
              {ctaData.heading}
            </h2>

            <div className="text-foreground/70 text-lg leading-relaxed mb-8 max-w-lg space-y-4">
              {
                ctaData.description?.split("\n").map((line, index) => (
                  <p key={index}><LinkProcessor text={line} /></p>
                ))
              }
            </div>

            {/* Quick benefits */}
            <div className="space-y-3">
              {ctaData.benefits?.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-foreground/80"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <LinkProcessor text={benefit?.text} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-foreground/5 backdrop-blur-md border border-primary-foreground/10 rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Send className="w-5 h-5 text-accent-foreground" />
                </span>
               Send Us Message
              </h3>

              {isLoadingForm ? (
                <div className="flex justify-center py-12">
                  <Spinner className="size-8 text-accent" />
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FieldGroup>
                    {dynamicForm ? (
                      <div className="grid gap-4">
                        {dynamicForm.fields.map((field: any) => (
                          <Controller
                            key={field._key || field.fieldName}
                            name={field.fieldName}
                            control={form.control}
                            rules={{ required: field.required }}
                            render={({ field: rField, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.fieldName}>
                                  {field.label} {field.required && "*"}
                                </FieldLabel>
                                {field.fieldType === 'textarea' ? (
                                  <Textarea
                                    {...rField}
                                    id={field.fieldName}
                                    placeholder={field.placeholder}
                                    className={cn(fieldBaseClass, "resize-none")}
                                  />
                                ) : (
                                  <Input
                                    {...rField}
                                    id={field.fieldName}
                                    type={field.fieldType === 'email' ? 'email' : 'text'}
                                    placeholder={field.placeholder}
                                    className={fieldBaseClass}
                                    autoComplete="off"
                                  />
                                )}
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
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
                                placeholder="Tell us about your project..."
                                className={cn(
                                  fieldBaseClass,
                                  "resize-none"
                                )}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </>
                    )}
                  </FieldGroup>

                  <MagneticButton strength={0.05} className="w-full">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl font-semibold text-sm group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Spinner className="size-4.5!" />
                      ) : (
                        <>
                          {dynamicForm?.submitButtonText || "Start Your Project"}
                          <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </MagneticButton>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </ContainerLayout>
    </section>
  );
};

export default CTA;
