"use client"

import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Code } from "lucide-react"

interface SchemaListInputProps {
    control?: any // Optional since we use useFormContext
    name: string
    label: string
}

export function SchemaListInput({ control: propControl, name, label }: SchemaListInputProps) {
    const { watch, setValue, control: contextControl } = useFormContext()
    const control = propControl || contextControl

    // Watch the schemas array
    const watchedValue = watch(name)
    const schemas: string[] = Array.isArray(watchedValue) ? watchedValue : []

    const addSchema = () => {
        setValue(name, [...schemas, ""], { shouldDirty: true, shouldValidate: true })
    }

    const removeSchema = (index: number) => {
        const newSchemas = schemas.filter((_, i) => i !== index)
        setValue(name, newSchemas, { shouldDirty: true, shouldValidate: true })
    }

    const handleChange = (index: number, value: string) => {
        const newSchemas = [...schemas]
        newSchemas[index] = value
        setValue(name, newSchemas, { shouldDirty: true, shouldValidate: true })
    }

    return (
        <div className="space-y-4 border p-4 rounded-md bg-card/50">
            <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    {label}
                </FormLabel>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSchema}
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Schema
                </Button>
            </div>

            <div className="space-y-4">
                {schemas.map((_, index) => (
                    <FormField
                        key={`${name}.${index}`}
                        control={control}
                        name={`${name}.${index}`}
                        render={({ field }) => (
                            <FormItem className="relative group">
                                <div className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={schemas[index]}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                                                className="min-h-[100px] font-mono text-xs"
                                            />
                                        </FormControl>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="shrink-0"
                                        onClick={() => removeSchema(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
            </div>

            {schemas.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground">No schema markups added yet.</p>
                    <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={addSchema}
                    >
                        Add your first schema
                    </Button>
                </div>
            )}
        </div>
    )
}
