"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/admin/form/FormInput"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function SectionHeadingCard({ control, baseName, title }: { control: any; baseName: string; title: string }) {
    return (
        <Card>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormInput control={control} name={`${baseName}.eyebrow`} label="Eyebrow" />
                <FormInput control={control} name={`${baseName}.title`} label="Title" />
                <FormInput control={control} name={`${baseName}.description`} label="Description" isTextarea />
            </CardContent>
        </Card>
    )
}

export function StatItemCard({ control, name, title, hasSuffix = true }: { control: any; name: string; title: string, hasSuffix?: boolean }) {
    return (
        <div className="space-y-4 pb-8 last:pb-0 border-b last:border-0 border-border/40">
            <h4 className="font-semibold text-base text-muted-foreground uppercase tracking-wider">{title}</h4>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-4">
                    <FormField
                        control={control}
                        name={`${name}.value`}
                        render={({ field }) => (
                            <FormItem className="pb-1">
                                <FormLabel className=" font-medium text-muted-foreground">Metric Value</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. 10" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {hasSuffix && (
                        <FormField
                            control={control}
                            name={`${name}.suffix`}
                            render={({ field }) => (
                                <FormItem className="pb-1">
                                    <FormLabel className=" font-medium text-muted-foreground">Suffix</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., +, %, K" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
                <div className="lg:col-span-7">
                    <FormInput
                        control={control}
                        name={`${name}.label`}
                        label="Display Label"
                    />
                </div>
            </div>
        </div>
    )
}
