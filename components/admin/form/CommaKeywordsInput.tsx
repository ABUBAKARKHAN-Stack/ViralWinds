"use client"

import React, { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Hash } from "lucide-react"

interface CommaKeywordsInputProps {
    name: string
    label: string
    placeholder?: string
}

export function CommaKeywordsInput({
    name,
    label,
    placeholder = "Type keyword and press comma or enter...",
}: CommaKeywordsInputProps) {
    const { control, setValue, watch } = useFormContext()
    const [inputValue, setInputValue] = useState("")

    // Watch the array in the form state
    const watchedValue = watch(name)
    const keywords: string[] = Array.isArray(watchedValue) ? watchedValue : []

    const handleAddKeyword = (val: string) => {
        const trimmed = val.trim()
        if (trimmed && !keywords.includes(trimmed)) {
            const newKeywords = [...keywords, trimmed]
            setValue(name, newKeywords, { shouldDirty: true, shouldValidate: true })
        }
        setInputValue("")
    }

    const removeKeyword = (keywordToRemove: string) => {
        const newKeywords = keywords.filter((k) => k !== keywordToRemove)
        setValue(name, newKeywords, { shouldDirty: true, shouldValidate: true })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault()
            handleAddKeyword(inputValue)
        } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
            removeKeyword(keywords[keywords.length - 1])
        }
    }

    return (
        <FormField
            control={control}
            name={name}
            render={() => (
                <FormItem className="space-y-3">
                    <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            {label}
                        </FormLabel>
                        <Badge variant="secondary" className="text-[10px] font-normal uppercase tracking-wider">
                            {keywords.length} Keywords
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 p-2 min-h-[45px] border rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                        {keywords.map((keyword, index) => (
                            <Badge
                                key={`${keyword}-${index}`}
                                variant="secondary"
                                className="pl-2 pr-1 py-1 flex items-center gap-1 group transition-colors hover:bg-secondary/80 animate-in fade-in zoom-in duration-200"
                            >
                                <span className="text-xs font-medium">{keyword}</span>
                                <button
                                    type="button"
                                    onClick={() => removeKeyword(keyword)}
                                    className="ml-1 rounded-full p-0.5 outline-none hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => handleAddKeyword(inputValue)}
                            placeholder={keywords.length === 0 ? placeholder : ""}
                            className="flex-1 bg-transparent outline-none text-sm min-w-[120px] placeholder:text-muted-foreground"
                        />
                    </div>
                    <FormDescription className="text-[11px]">
                        Separate keywords with commas or press Enter.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
