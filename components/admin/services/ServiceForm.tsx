"use client"

import { useCallback, useState, useEffect, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceFormSchema, ServiceFormValues } from "@/lib/validations/service"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormLabel,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormInput } from "@/components/admin/form/FormInput"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, ArrowLeft, Clock } from "lucide-react"
import { createService, updateService } from "@/app/actions/service"
import { saveServiceDraft } from "@/app/actions/serviceDraftActions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { ImageUpload } from "@/components/admin/form/ImageUpload"
import { Spinner } from "@/components/ui/spinner"
import { CommaKeywordsInput } from "@/components/admin/form/CommaKeywordsInput"
import { SchemaListInput } from "@/components/admin/form/SchemaListInput"
import { debounce } from "lodash"


interface ServiceFormProps {
    initialData?: ServiceFormValues
    serviceId?: string
    hasDraft?: boolean
    draftUpdatedAt?: string | null
    availableServices?: any[]
}

export function ServiceForm({
    initialData,
    serviceId,
    draftUpdatedAt,
}: ServiceFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(
        draftUpdatedAt ? new Date(draftUpdatedAt) : null
    )
    const [isInitialMount, setIsInitialMount] = useState(true)
    const [currentServiceId] = useState(serviceId)
    const router = useRouter()
    const isSubmittingRef = useRef(false)

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceFormSchema) as any,
        defaultValues: initialData || {
            title: "",
            description: "",
            heroImageAlt: "",
            items: ["", ""],

        } as ServiceFormValues,
    })

    const formControl = form.control

    const saveDraft = useCallback(
        debounce(async (data: Partial<ServiceFormValues>) => {
            if (isInitialMount || !currentServiceId || isSubmittingRef.current) return

            setIsSavingDraft(true)
            try {
                const result = await saveServiceDraft(currentServiceId, data)
                if (result.success) {
                    setLastSaved(new Date())

                    // If we're on the "add" page, redirect to "edit" to keep the same ID
                    if (typeof window !== 'undefined' && window.location.pathname.endsWith('/admin/services/add')) {
                        const newUrl = `/admin/services/edit/${currentServiceId}`
                        router.replace(newUrl, { scroll: false })
                    }
                }
            } catch (error) {
                console.error("Draft save failed:", error)
            } finally {
                setIsSavingDraft(false)
            }
        }, 2000),
        [isInitialMount, currentServiceId, router]
    )

    useEffect(() => {
        const timer = setTimeout(() => setIsInitialMount(false), 1000)
        return () => clearTimeout(timer)
    }, [])


    useEffect(() => {
        const subscription = form.watch((value) => {
            saveDraft(value as Partial<ServiceFormValues>)
        })
        return () => subscription.unsubscribe()
    }, [form, saveDraft])

    const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
        control: form.control,
        name: "items" as never,
    })


    const hasTabErrors = (fields: string[]) => {
        return fields.some(field => {
            if (field.includes('.')) {
                const [parent, ...rest] = field.split('.')
                const parentErrors = form.formState.errors[parent as keyof ServiceFormValues] as any
                if (!parentErrors) return false

                // Handle arrays and objects
                let current = parentErrors
                for (const key of rest) {
                    if (!current) return false
                    current = current[key]
                }
                return !!current
            }
            return !!form.formState.errors[field as keyof ServiceFormValues]
        })
    }

    const ErrorDot = () => (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
        </span>
    )

    async function onSubmit(data: ServiceFormValues) {

        setIsLoading(true)
        try {
            const result = serviceId
                ? await updateService(serviceId, data)
                : await createService(data)

            if (result.success) {
                successToast(serviceId ? "Service updated successfully!" : "Service created successfully!")
                setLastSaved(null)
                router.push("/admin/services")
            } else {
                errorToast(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error(error)
            errorToast("An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-30 py-2 sm:py-3 px-1 border-b gap-3">
                    <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild className="h-9">
                                <Link href="/admin/services">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> <span className="sm:inline hidden">Back</span>
                                </Link>
                            </Button>
                            <div className="sm:hidden font-bold text-sm truncate max-w-[150px]">
                                {serviceId ? "Edit Service" : "New Service"}
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="font-bold text-lg leading-none">
                                    {serviceId ? "Edit Service" : "New Service"}
                                </span>
                                <div className="flex items-center gap-3 text-muted-foreground text-xs mt-1">
                                    {isSavingDraft && (
                                        <span className="flex items-center gap-1 text-blue-600">
                                            <Spinner className="h-3 w-3" />
                                            Saving...
                                        </span>
                                    )}
                                    {lastSaved && !isSavingDraft && (
                                        <span className="flex items-center gap-1 text-green-600 font-medium">
                                            <Clock className="h-3 w-3" />
                                            Draft Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-9 min-w-[120px]">
                            {isLoading ? (
                                <><Spinner className="mr-2 h-4 w-4" /> Saving...</>
                            ) : (
                                serviceId ? "Update Service" : "Create Service"
                            )}
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <div className="relative mb-6">
                        <TabsList className="flex w-full h-auto flex-wrap gap-1 p-1 bg-muted/50 rounded-lg justify-start">
                            <TabsTrigger value="general" className="px-4 py-2 text-xs sm:text-sm relative">
                                General
                                {hasTabErrors(['title', 'subtitle', 'description', 'slug', 'heroImageAlt']) && <ErrorDot />}
                            </TabsTrigger>
                            <TabsTrigger value="overview" className="px-4 py-2 text-xs sm:text-sm relative">
                                Overview
                                {hasTabErrors(['overviewSection', 'items']) && <ErrorDot />}
                            </TabsTrigger>
                          
                        </TabsList>
                    </div>

                    <TabsContent value="general" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormInput control={formControl} name="title" label="Title" />
                                <FormInput control={formControl} name="description" label="Description" type="textarea" />


                                <FormField
                                    control={formControl}
                                    name="heroImage"
                                    render={({ field }) => (
                                        <ImageUpload
                                            value={field.value as any}
                                            onChange={(asset) => {
                                                if (!asset) {
                                                    field.onChange(undefined)
                                                    return
                                                }
                                                field.onChange({
                                                    _type: 'image',
                                                    asset: {
                                                        _type: 'reference',
                                                        _ref: asset._id || asset.id,
                                                    },
                                                    url: asset.url
                                                })
                                            }}
                                            label="Hero Image"
                                        />
                                    )}
                                />

                                <FormInput control={formControl} name="heroImageAlt" label="Hero Image Alt Text" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="overview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Overview Section</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4 mt-6">
                                    <FormLabel>Service Overview Items</FormLabel>
                                    {itemFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-start">
                                            <div className="flex-1">
                                                <FormInput
                                                    control={formControl}
                                                    name={`items.${index}`}
                                                    label={`Item ${index + 1}`}
                                                />
                                            </div>
                                            {itemFields.length > 1 && (
                                                <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendItem("")}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Item
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    )
}
