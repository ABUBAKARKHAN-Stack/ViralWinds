"use client"

import { Control } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "./FormInput"
import { CommaKeywordsInput } from "./CommaKeywordsInput"
import { SchemaListInput } from "./SchemaListInput"
import { Globe } from "lucide-react"

interface SeoFormTabProps {
    control: Control<any>
    baseName?: string // e.g., "seo"
}

export function SeoFormTab({ control, baseName = "seo" }: SeoFormTabProps) {
    const getFieldName = (name: string) => baseName ? `${baseName}.${name}` : name

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Meta Tags
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormInput
                        control={control}
                        name={getFieldName("metaTitle")}
                        label="Meta Title"
                        placeholder="Page title displayed in search results"
                    />
                    <FormInput
                        control={control}
                        name={getFieldName("metaDescription")}
                        label="Meta Description"
                        isTextarea
                        rows={4}
                        placeholder="Brief summary of the page for search engines"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Keywords</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormInput
                        control={control}
                        name={getFieldName("focusKeyword")}
                        label="Focus Keyword"
                        placeholder="The primary keyword you want to rank for"
                    />
                    <CommaKeywordsInput
                        name={getFieldName("relatedKeywords")}
                        label="Related Keywords"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Structured Data (JSON-LD)</CardTitle>
                </CardHeader>
                <CardContent>
                    <SchemaListInput
                        control={control}
                        name={getFieldName("schemas")}
                        label="Schema Markups"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
