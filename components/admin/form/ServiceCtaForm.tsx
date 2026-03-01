"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceCtaFormSchema, ServiceCtaValues } from "@/lib/validations/service-cta"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormInput } from "@/components/admin/form/FormInput"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateServiceCta } from "@/app/actions/serviceCta"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Spinner } from "@/components/ui/spinner"
import { Save, AlertCircle } from "lucide-react"

interface ServiceCtaFormProps {
    initialData?: ServiceCtaValues
}

export function ServiceCtaForm({ initialData }: ServiceCtaFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ServiceCtaValues>({
        resolver: zodResolver(serviceCtaFormSchema),
        defaultValues: initialData || {
            ctaBadgeText: "",
            ctaTitle: "",
            ctaDescription: "",
            ctaButtonText: "",
            ctaButtonUrl: "",
        },
    })

    const formControl = form.control as any

    async function onSubmit(values: ServiceCtaValues) {
        setIsLoading(true)
        try {
            const result = await updateServiceCta(values)
            if (result.success) {
                successToast("Service settings updated successfully")
            } else {
                errorToast(result.error || "Failed to update settings")
            }
        } catch (error) {
            errorToast("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-2 sm:py-4 border-b">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Services Settings</h1>
                        <p className="text-muted-foreground text-xs sm:text-sm">Manage the Call-to-Action section for the services page.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto min-w-[120px] h-9 sm:h-10 text-sm sm:text-base">
                            {isLoading ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Settings
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Call to Action Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormInput control={formControl} name="ctaBadgeText" label="Badge Text" />
                            <FormInput control={formControl} name="ctaTitle" label="Main Title" />
                            <FormInput control={formControl} name="ctaDescription" label="Description" isTextarea />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-6">
                                    <h3 className="font-medium text-sm text-muted-foreground">Button Text</h3>
                                    <FormInput control={formControl} name="ctaButtonText" label="Button Label" />
                                </div>
                                <div className="space-y-6">
                                    <h3 className="font-medium text-sm text-muted-foreground">Button URL</h3>
                                    <FormInput control={formControl} name="ctaButtonUrl"
                                        placeholder="https://example.com or /contact"
                                        label="Destination URL" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </Form>
    )
}
