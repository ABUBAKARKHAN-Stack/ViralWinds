"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactPageContentSchema, ContactPageContentValues } from "@/lib/validations/contact-page-content"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormInput } from "@/components/admin/form/FormInput"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateContactPageContent, saveContactPageDraft, discardContactPageDraft } from "@/app/actions/contactPageContent"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Spinner } from "@/components/ui/spinner"
import { Save, AlertCircle, Plus, Trash2, Clock, X } from "lucide-react"
import { debounce } from "lodash"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SeoFormTab } from "./SeoFormTab"
import { SectionHeadingCard } from "./SharedFormComponents"

interface ContactPageContentFormProps {
    initialData?: any
    hasDraft?: boolean
    draftUpdatedAt?: string | null
    availableForms?: any[]
}

export function ContactPageContentForm({ initialData, hasDraft, draftUpdatedAt, availableForms = [] }: ContactPageContentFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(
        draftUpdatedAt ? new Date(draftUpdatedAt) : null
    )
    const [isInitialMount, setIsInitialMount] = useState(true)

    const form = useForm<ContactPageContentValues>({
        resolver: zodResolver(contactPageContentSchema),
        mode: "onChange",
        defaultValues: initialData ? mergeWithDefaults(initialData) : getDefaultValues(),
    })

    const formControl = form.control as any

    // Auto-save draft functionality
    const saveDraft = useCallback(
        debounce(async (data: Partial<ContactPageContentValues>) => {
            if (isInitialMount) return
            setIsSavingDraft(true)
            try {
                const result = await saveContactPageDraft(data)
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
            saveDraft(value as Partial<ContactPageContentValues>)
        })
        return () => subscription.unsubscribe()
    }, [form, saveDraft])

    const { fields: faqItems, append: appendFaqItem, remove: removeFaqItem } = useFieldArray({
        control: formControl,
        name: "faqs.faqItems",
    })

    async function onSubmit(values: ContactPageContentValues) {
        setIsLoading(true)
        try {
            const result = await updateContactPageContent(values)
            if (result.success) {
                successToast("Contact page content published successfully")
                await discardContactPageDraft()
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
    const hasErrors = Object.keys(formErrors).length > 0

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-20 bg-background/95 backdrop-blur py-4 border-b">
                    <div>
                        <h1 className="text-2xl font-bold">Contact Page Content</h1>
                        <div className="flex items-center gap-3 text-muted-foreground text-sm mt-1">
                            <p>Manage hero, contact form, and FAQs</p>
                            {isSavingDraft && (
                                <span className="flex items-center gap-1 text-blue-600">
                                    <Spinner className="h-3 w-3" />
                                    Saving...
                                </span>
                            )}
                            {lastSaved && !isSavingDraft && (
                                <span className="flex items-center gap-1 text-green-600">
                                    <Clock className="h-3 w-3" />
                                    Draft Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-l pl-4">
                           
                            {hasErrors && (
                                <div className="flex items-center gap-2 text-destructive text-xs px-3 py-1 bg-destructive/10 rounded">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>Fix form errors</span>
                                </div>
                            )}
                            <Button type="submit" disabled={isLoading || hasErrors}>
                                {isLoading ? <><Spinner className="mr-2 h-4 w-4" /> Publishing...</> : <><Save className="mr-2 h-4 w-4" /> Publish</>}
                            </Button>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="hero" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 gap-2 h-auto bg-transparent p-0 mb-6 font-display font-medium">
                        <TabsTrigger value="hero" className="relative data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                            Hero
                            {formErrors.hero && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="contactForm" className="relative data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                            Contact Form
                            {formErrors.contactForm && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="faqs" className="relative data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                            FAQs
                            {formErrors.faqs && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="seo" className="relative data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                            SEO
                            {formErrors.seo && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="hero">
                        <Card>
                            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="hero.title" label="Title" />
                                <FormInput control={formControl} name="hero.subtitle" label="Subtitle" />
                                <FormInput control={formControl} name="hero.description" label="Description" isTextarea />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contactForm">
                        <Card>
                            <CardHeader><CardTitle>Contact Form Settings</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="contactForm.formHeading" label="Form Heading" />
                                <FormInput control={formControl} name="contactForm.formDescription" label="Form Description" isTextarea />

                                <FormField
                                    control={formControl}
                                    name="contactForm.formReference"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Form</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a form to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableForms.map((f) => (
                                                        <SelectItem key={f._id} value={f._id}>
                                                            {f.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="faqs" className="space-y-6">
                        <SectionHeadingCard control={formControl} baseName="faqs.sectionHeading" title="FAQs Section Heading" />

                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle>FAQ Items</CardTitle>
                                <Button type="button" size="sm" variant="outline" onClick={() => appendFaqItem({ question: "", answer: "" })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add FAQ
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {faqItems.map((field, index) => (
                                    <div key={field.id} className="border rounded p-4 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">FAQ Item {index + 1}</span>
                                            <Button type="button" size="sm" variant="destructive" onClick={() => removeFaqItem(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormInput control={formControl} name={`faqs.faqItems.${index}.question`} label="Question" />
                                        <FormInput control={formControl} name={`faqs.faqItems.${index}.answer`} label="Answer" isTextarea />
                                    </div>
                                ))}
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

function getDefaultValues(): ContactPageContentValues {
    return {
        hero: {
            title: "",
            subtitle: "",
            description: "",
        },
        contactForm: {
            formHeading: "",
            formDescription: "",
            formReference: "",
        },
        faqs: {
            sectionHeading: { eyebrow: "", title: "", description: "" },
            faqItems: [],
        },
        seo: {
            metaTitle: "",
            metaDescription: "",
            focusKeyword: "",
            relatedKeywords: [],
            schemas: []
        }
    }
}

function mergeWithDefaults(data: any): ContactPageContentValues {
    const defaults = getDefaultValues()
    return {
        ...data,
        hero: { ...defaults.hero, ...data.hero },
        contactForm: {
            ...defaults.contactForm,
            ...data.contactForm,
            formReference: typeof data.contactForm?.formReference === 'object'
                ? data.contactForm.formReference?._ref
                : data.contactForm?.formReference || ""
        },
        faqs: {
            sectionHeading: { ...defaults.faqs?.sectionHeading, ...data.faqs?.sectionHeading },
            faqItems: data.faqs?.faqItems || defaults.faqs?.faqItems || [],
        },
        seo: {
            ...defaults.seo,
            ...data.seo,
            relatedKeywords: data.seo?.relatedKeywords || [],
            schemas: data.seo?.schemas || []
        }
    }
}
