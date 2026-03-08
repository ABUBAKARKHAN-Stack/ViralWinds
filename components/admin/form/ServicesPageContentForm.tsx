"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { servicesPageContentSchema, ServicesPageContentValues } from "@/lib/validations/services-page-content"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormInput } from "@/components/admin/form/FormInput"
import { IconSelect } from "@/components/admin/form/IconSelect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SeoFormTab } from "./SeoFormTab"
import { updateServicesPageContent, saveServicesPageDraft } from "@/app/actions/servicesPageContent"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Spinner } from "@/components/ui/spinner"
import { Save, Plus, Trash2, Clock } from "lucide-react"
import { debounce } from "lodash"
import { ReferenceSelector } from "@/components/admin/form/ReferenceSelector"
import { getAllServices } from "@/app/actions/servicesPageContent"

interface ServicesPageContentFormProps {
    initialData?: ServicesPageContentValues
    hasDraft?: boolean
    draftUpdatedAt?: string | null
}

export function ServicesPageContentForm({ initialData, hasDraft, draftUpdatedAt }: ServicesPageContentFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(
        draftUpdatedAt ? new Date(draftUpdatedAt) : null
    )
    const [isInitialMount, setIsInitialMount] = useState(true)

    const [allServices, setAllServices] = useState<any[]>([])

    const form = useForm<ServicesPageContentValues>({
        resolver: zodResolver(servicesPageContentSchema),
        defaultValues: mergeWithDefaults(initialData),
    })

    const formControl = form.control as any

    const saveDraft = useCallback(
        debounce(async (data: Partial<ServicesPageContentValues>) => {
            if (isInitialMount) return
            setIsSavingDraft(true)
            try {
                const result = await saveServicesPageDraft(data)
                if (result.success) {
                    setLastSaved(new Date())
                }
            } catch (error) {
                console.error("Draft save failed:", error)
            } finally {
                setIsSavingDraft(false)
            }
        }, 2000),
        [isInitialMount]
    )

    useEffect(() => {
        const timer = setTimeout(() => setIsInitialMount(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const subscription = form.watch((value) => {
            saveDraft(value as Partial<ServicesPageContentValues>)
        })
        return () => subscription.unsubscribe()
    }, [form, saveDraft])

    useEffect(() => {

        async function fetchAllServices() {
            const services = await getAllServices()
            setAllServices(services)
        }

        fetchAllServices()
    }, [])

    const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
        control: formControl,
        name: "process.steps",
    })

    const { fields: guaranteeFields, append: appendGuarantee, remove: removeGuarantee } = useFieldArray({
        control: formControl,
        name: "whyChooseUs.guaranteePoints",
    })

    const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
        control: formControl,
        name: "whyChooseUs.benefits",
    })

    async function onSubmit(values: ServicesPageContentValues) {
        setIsLoading(true)
        try {
            const result = await updateServicesPageContent(values)
            if (result.success) {
                successToast("Services page content updated successfully")
                setLastSaved(null)
            } else {
                errorToast(result.error || "Failed to update content")
            }
        } catch (error) {
            errorToast("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const formErrors = form.formState.errors

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-20 bg-background/95 backdrop-blur py-2 sm:py-4 border-b">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Services Page Content</h1>
                        <div className="flex items-center gap-3 text-muted-foreground text-xs sm:text-sm mt-1">
                            <p className="hidden sm:inline">Manage all sections of the services landing page.</p>
                            {isSavingDraft && (
                                <span className="flex items-center gap-1 text-blue-600">
                                    <Spinner className="h-3 w-3" /> Saving...
                                </span>
                            )}
                            {lastSaved && !isSavingDraft && (
                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                    <Clock className="h-3 w-3" /> Draft Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto min-w-[120px]">
                            {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Content
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="hero" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-2 bg-transparent p-0 mb-6">
                        <TabsTrigger value="hero" className="border h-10 relative">
                            Hero
                            {!!formErrors.hero && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="intro" className="border h-10 relative">
                            Intro
                            {!!formErrors.intro && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="servicesList" className="border h-10 relative">
                            Services List
                            {!!(formErrors as any).servicesList && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="process" className="border h-10 relative">
                            Process
                            {!!formErrors.process && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="whyChooseUs" className="border h-10 relative">
                            Why Us
                            {!!formErrors.whyChooseUs && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>


                        <TabsTrigger value="seo" className="border h-10 relative">
                            SEO
                            {!!formErrors.seo && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="hero" className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="hero.title" label="Title" />
                                <FormInput control={formControl} name="hero.subtitle" label="Subtitle" />
                                <FormInput control={formControl} name="hero.description" label="Description" isTextarea />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="intro" className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Introduction Section</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="intro.badgeText" label="Badge Text" />
                                <FormInput control={formControl} name="intro.heading" label="Main Heading" />
                                <FormInput control={formControl} name="intro.headingAccent" label="Heading Accent (Highlighted)" />
                                <FormInput control={formControl} name="intro.description" label="Description" isTextarea />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="process" className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Section Heading</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="process.sectionHeading.eyebrow" label="Eyebrow Text" />
                                <FormInput control={formControl} name="process.sectionHeading.title" label="Title" />
                                <FormInput control={formControl} name="process.sectionHeading.description" label="Description" isTextarea />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Process Steps</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendStep({ title: "", description: "", duration: "", iconName: "" })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Step
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {stepFields.map((field, index) => (
                                    <div key={field.id} className="border rounded-lg p-4 space-y-4 relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-sm">Step {index + 1}</span>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeStep(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormInput control={formControl} name={`process.steps.${index}.title`} label="Title" />
                                        <FormInput control={formControl} name={`process.steps.${index}.description`} label="Description" isTextarea />
                                        <FormInput control={formControl} name={`process.steps.${index}.duration`} label="Duration" />
                                        <FormField control={formControl} name={`process.steps.${index}.iconName`} render={({ field }) => <IconSelect field={field} type="process" label="Icon" />} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="whyChooseUs" className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Section Heading</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="whyChooseUs.sectionHeading.eyebrow" label="Eyebrow Text" />
                                <FormInput control={formControl} name="whyChooseUs.sectionHeading.title" label="Title" />
                                <FormInput control={formControl} name="whyChooseUs.sectionHeading.description" label="Description" isTextarea />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Guarantee Points</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendGuarantee("")}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Point
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {guaranteeFields.map((field, index) => (
                                    <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-sm">Point {index + 1}</span>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeGuarantee(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormInput control={formControl} name={`whyChooseUs.guaranteePoints.${index}`} label="Guarantee Statement" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Benefits</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendBenefit({ title: "", description: "", iconName: "" })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Benefit
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {benefitFields.map((field, index) => (
                                    <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-sm">Benefit {index + 1}</span>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeBenefit(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormInput control={formControl} name={`whyChooseUs.benefits.${index}.title`} label="Title" />
                                        <FormInput control={formControl} name={`whyChooseUs.benefits.${index}.description`} label="Description" isTextarea />
                                        <FormField control={formControl} name={`whyChooseUs.benefits.${index}.iconName`} render={({ field }) => <IconSelect field={field} type="benefit" label="Icon" />} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>



                    <TabsContent value="servicesList" className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Section Heading</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="servicesList.sectionHeading.eyebrow" label="Eyebrow Text" />
                                <FormInput control={formControl} name="servicesList.sectionHeading.title" label="Title" />
                                <FormInput control={formControl} name="servicesList.sectionHeading.description" label="Description" isTextarea />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Services Selection</CardTitle></CardHeader>
                            <CardContent>
                                <ReferenceSelector
                                    form={form}
                                    fieldName="servicesList.services"
                                    items={allServices}
                                    label="Select Services"
                                    max={12}
                                    placeholder="Search services..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="seo">
                        <SeoFormTab control={formControl} />
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    )
}

function getDefaultValues(): ServicesPageContentValues {
    return {
        hero: { title: "", subtitle: "", description: "" },
        intro: { badgeText: "", heading: "", headingAccent: "", description: "" },
        process: { sectionHeading: { eyebrow: "", title: "", description: "" }, steps: [] },
        whyChooseUs: { sectionHeading: { eyebrow: "", title: "", description: "" }, guaranteePoints: [], benefits: [] },

        servicesList: { sectionHeading: { eyebrow: "", title: "", description: "" }, services: [] },
        seo: { metaTitle: "", metaDescription: "", focusKeyword: "", relatedKeywords: [], schemas: [] }
    } as ServicesPageContentValues
}

function mergeWithDefaults(data: any): ServicesPageContentValues {
    const defaults = getDefaultValues()
    if (!data) return defaults

    return {
        ...defaults,
        ...data,
        hero: { ...defaults.hero, ...data.hero },
        intro: { ...defaults.intro, ...data.intro },
        process: {
            ...defaults.process,
            ...data.process,
            sectionHeading: { ...defaults.process.sectionHeading, ...data.process?.sectionHeading },
            steps: data.process?.steps || defaults.process.steps
        },
        whyChooseUs: {
            ...defaults.whyChooseUs,
            ...data.whyChooseUs,
            sectionHeading: { ...defaults.whyChooseUs.sectionHeading, ...data.whyChooseUs?.sectionHeading },
            guaranteePoints: data.whyChooseUs?.guaranteePoints || defaults.whyChooseUs.guaranteePoints,
            benefits: data.whyChooseUs?.benefits || defaults.whyChooseUs.benefits
        },

        servicesList: {
            ...defaults.servicesList,
            ...data.servicesList,
            sectionHeading: { ...defaults.servicesList.sectionHeading, ...data.servicesList?.sectionHeading },
            services: data.servicesList?.services || defaults.servicesList.services,
        },
        seo: {
            ...defaults.seo,
            ...data.seo,
            relatedKeywords: data.seo?.relatedKeywords || defaults.seo?.relatedKeywords || [],
            schemas: data.seo?.schemas || defaults.seo?.schemas || []
        }
    } as ServicesPageContentValues
}
