"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "motion/react"
import { Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { submitDynamicForm } from "@/app/actions/submitDynamicForm"
import { toast } from "sonner"

interface FormField {
    _key?: string
    fieldType: string
    fieldName: string
    label: string
    placeholder?: string
    required: boolean
    options?: Array<{ label: string; value: string }>
}

interface DynamicFormProps {
    formId: string
    formName: string
    fields: FormField[]
    submitButtonText: string
    successMessage: string
    className?: string
}

export default function DynamicForm({
    formId,
    formName,
    fields,
    submitButtonText,
    successMessage,
    className
}: DynamicFormProps) {
    const [isSuccess, setIsSuccess] = useState(false)

    // Generate Zod schema dynamically
    const schemaShape: any = {}
    fields.forEach(field => {
        let fieldSchema: any = z.string()
        if (field.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`)
        } else {
            fieldSchema = fieldSchema.optional().or(z.literal(""))
        }

        // Add more specific validations if needed based on fieldType
        if (field.fieldType === 'email') {
            fieldSchema = fieldSchema.pipe(z.email("Invalid email address"))
        }

        schemaShape[field.fieldName] = fieldSchema
    })

    const formSchema = z.object(schemaShape)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: fields.reduce((acc, field) => ({ ...acc, [field.fieldName]: "" }), {} as Record<string, any>)
    })

    const { isLoading } = form.formState

    async function onSubmit(data: any) {
        try {
            const result = await submitDynamicForm(formId, formName, data, successMessage)
            if (result.success) {
                setIsSuccess(true)
                form.reset()
                toast.success(result.message)
            } else {
                toast.error(result.error || "Submission failed")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        }
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-6 bg-accent/5 rounded-2xl border border-accent/20"
            >
                <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">{successMessage}</h3>
                <p className="text-muted-foreground mb-8">We have received your message and will get back to you soon.</p>
                <Button variant="outline" onClick={() => setIsSuccess(false)}>
                    Send another message
                </Button>
            </motion.div>
        )
    }

    const fieldBaseClass = "border-0 border-b rounded-none px-1 py-0! focus-visible:ring-0 bg-transparent! transition-colors border-border hover:border-accent/50 focus:border-accent"

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", className)}>
            <FieldGroup>
                {fields.map((field) => (
                    <Controller
                        key={field._key || field.fieldName}
                        name={field.fieldName}
                        control={form.control}
                        render={({ field: fieldProps, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.fieldName}>
                                    {field.label} {field.required && "*"}
                                </FieldLabel>

                                {field.fieldType === 'textarea' ? (
                                    <Textarea
                                        {...fieldProps}
                                        id={field.fieldName}
                                        placeholder={field.placeholder}
                                        className={cn(fieldBaseClass, "resize-none min-h-[100px]")}
                                    />
                                ) : field.fieldType === 'select' ? (
                                    <Select
                                        onValueChange={fieldProps.onChange}
                                        defaultValue={fieldProps.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={fieldBaseClass}>
                                                <SelectValue placeholder={field.placeholder} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {field.options?.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        {...fieldProps}
                                        id={field.fieldName}
                                        type={field.fieldType === 'email' ? 'email' : 'text'}
                                        placeholder={field.placeholder}
                                        className={fieldBaseClass}
                                    />
                                )}

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                ))}

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
                            {submitButtonText}
                            <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </Button>
            </FieldGroup>
        </form>
    )
}

function FormControl({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
