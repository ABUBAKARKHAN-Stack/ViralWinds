"use client"

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Control } from "react-hook-form"
import React from "react"
import { cn } from "@/lib/utils"

interface FormInputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "name" | "type"> {
    control: Control<any>
    name: string
    label: string
    type?: "text" | "textarea" | "email" | "password" | "number" | "tel" | "url"
    isTextarea?: boolean // Keep for backward compatibility
    rows?: number
    compact?: boolean
    noBorder?: boolean
    isUrl?: boolean
    className?: string
}

export function FormInput({
    control,
    name,
    label,
    placeholder,
    type,
    isTextarea = false,
    rows = 3,
    compact = false,
    noBorder = false,
    isUrl = false,
    className,
    ...props
}: FormInputProps) {
    const isActuallyTextarea = isTextarea || type === "textarea"
    const inputType = isUrl ? "url" : (type || "text")
    const placeholderText = placeholder || (isUrl ? "https://example.com or /contact" : `Enter ${label.toLowerCase()}...`)

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={compact ? "space-y-1" : "space-y-2"}>
                    <div className="flex items-center justify-between">
                        <FormLabel className={compact ? "text-[11px] uppercase tracking-wider text-muted-foreground font-bold italic" : ""}>
                            {label}
                        </FormLabel>
                        {isActuallyTextarea && !compact && (
                            <span className="text-[10px] text-muted-foreground italic font-medium px-2 py-0.5 bg-muted/50 rounded-full">
                                Hint: &quot;/url &lt;Label&gt;&quot;
                            </span>
                        )}
                    </div>
                    <FormControl>
                        {isActuallyTextarea ? (
                            <Textarea
                                {...field}
                                value={field.value || ""}
                                placeholder={placeholderText}
                                rows={rows}
                                className={cn(
                                    noBorder && "border-none shadow-none focus-visible:ring-0 px-0",
                                    className
                                )}
                                {...(props as any)}
                            />
                        ) : (
                            <Input
                                {...field}
                                type={inputType}
                                value={field.value || ""}
                                placeholder={placeholderText}
                                className={cn(
                                    noBorder && "border-transparent px-0 bg-transparent focus-visible:ring-0 shadow-none",
                                    className
                                )}
                                {...props}
                            />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
