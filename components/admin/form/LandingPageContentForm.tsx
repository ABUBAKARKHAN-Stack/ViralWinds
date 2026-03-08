"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { landingPageContentSchema, LandingPageContentValues } from "@/lib/validations/landing-page-content"
import { globalSectionsSchema, GlobalSectionsValues } from "@/lib/validations/global-sections"

type CombinedValues = LandingPageContentValues & GlobalSectionsValues;
const combinedSchema = landingPageContentSchema.merge(globalSectionsSchema);
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormInput } from "@/components/admin/form/FormInput"
import { BulkImageUpload } from "@/components/admin/form/BulkImageUpload"
import { ImageUpload } from "@/components/admin/form/ImageUpload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateLandingPageContent, saveLandingPageDraft, discardLandingPageDraft } from "@/app/actions/landingPageContent"
import { updateGlobalSections, saveGlobalSectionsDraft, discardGlobalSectionsDraft } from "@/app/actions/globalSections"
import { GlobalSectionsFormTabs } from "@/components/admin/form/GlobalSectionsFormTabs"
import { SectionHeadingCard } from "@/components/admin/form/SharedFormComponents"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Spinner } from "@/components/ui/spinner"
import { Plus, Trash2, Save, Send, Clock, AlertCircle, ArrowUp, ArrowDown, Search, CheckCircle2 } from "lucide-react"
import { ReferenceSelector } from "./ReferenceSelector"
import { debounce } from "lodash"
import { SeoFormTab } from "./SeoFormTab"

interface LandingPageContentFormProps {
    initialData?: CombinedValues & { _updatedAt?: string }
    hasDraft?: boolean
    draftUpdatedAt?: string | null
    services?: any[]
    projects?: any[]
    caseStudies?: any[]
}

export function LandingPageContentForm({
    initialData,
    hasDraft,
    draftUpdatedAt,
    services = [],
    projects = [],
    caseStudies = [],
}: LandingPageContentFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(
        draftUpdatedAt ? new Date(draftUpdatedAt) : null
    )
    const [isInitialMount, setIsInitialMount] = useState(true)
    const [serviceSearchTerm, setServiceSearchTerm] = useState("")

    const form = useForm<CombinedValues>({
        resolver: zodResolver(combinedSchema),
        mode: "onChange",
        defaultValues: initialData ? mergeWithDefaults(initialData) : getDefaultValues(),
    })

    const formControl = form.control as any

    // Auto-save draft functionality
    const saveDraft = useCallback(
        debounce(async (data: Partial<CombinedValues>) => {
            if (isInitialMount) return

            setIsSavingDraft(true)
            try {
                // Split data into local and global
                const localData = { ...data }
                const globalFields = ['stats', 'servicesPreview', 'whyChooseUs', 'ourApproach', 'industriesWeServe', 'faqs', 'leadership', 'cta']
                const globalData: any = {}
                globalFields.forEach(field => {
                    if (localData[field as keyof typeof localData]) {
                        globalData[field] = localData[field as keyof typeof localData]
                    }
                })

                const [result1, result2] = await Promise.all([
                    saveLandingPageDraft(localData),
                    saveGlobalSectionsDraft(globalData)
                ])

                if (result1.success && result2.success) {
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
        const timer = setTimeout(() => {
            setIsInitialMount(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const subscription = form.watch((value) => {
            saveDraft(value as Partial<CombinedValues>)
        })
        return () => subscription.unsubscribe()
    }, [form, saveDraft])

    // Field arrays for Hero section
    const { fields: headingLineFields, append: appendHeadingLine, remove: removeHeadingLine } = useFieldArray({
        control: formControl,
        name: "hero.headingLines",
    })

    const { fields: paragraphFields, append: appendParagraph, remove: removeParagraph } = useFieldArray({
        control: formControl,
        name: "hero.descriptionParagraphs",
    })

    const { fields: ctaButtonFields, append: appendCtaButton, remove: removeCtaButton } = useFieldArray({
        control: formControl,
        name: "hero.ctaButtons",
    })

    const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
        control: formControl,
        name: "serviceHighlightsMarquee.highlights",
    })

    const { fields: leftDescFields, append: appendLeftDesc, remove: removeLeftDesc } = useFieldArray({
        control: formControl,
        name: "aboutPreview.leftDescriptions",
    })

    const { fields: rightDescFields, append: appendRightDesc, remove: removeRightDesc } = useFieldArray({
        control: formControl,
        name: "aboutPreview.rightDescriptions",
    })

    const { fields: areaFields, append: appendArea, remove: removeArea } = useFieldArray({
        control: formControl,
        name: "areasWeServe.areas",
    })

    const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({
        control: formControl,
        name: "testimonials.testimonials",
    })

    async function onSubmit(values: CombinedValues) {
        setIsLoading(true)
        try {
            // Split data
            const localData = { ...values }
            const globalFields = ['stats', 'servicesPreview', 'whyChooseUs', 'ourApproach', 'industriesWeServe', 'faqs', 'leadership', 'cta']
            const globalData: any = {}
            globalFields.forEach(field => {
                globalData[field] = localData[field as keyof typeof localData]
            })

            const [result1, result2] = await Promise.all([
                updateLandingPageContent(values),
                updateGlobalSections(globalData)
            ])

            if (result1.success && result2.success) {
                successToast("All content published successfully")
                await Promise.all([
                    discardLandingPageDraft(),
                    discardGlobalSectionsDraft()
                ])
                setLastSaved(null)
            } else {
                errorToast(result1.success ? result2.error : result1.error || "Failed to update content")
            }
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
                        <h1 className="text-2xl font-bold">Landing Page Content</h1>
                        <div className="flex items-center gap-3 text-muted-foreground text-sm mt-1">
                            <p>Manage all sections</p>
                            {isSavingDraft && (
                                <span className="flex items-center gap-1 text-blue-600">
                                    <Spinner className="h-3 w-3" />
                                    Saving...
                                </span>
                            )}
                            {lastSaved && !isSavingDraft && (
                                <span className="flex items-center gap-1 text-green-600">
                                    <Clock className="h-3 w-3" />
                                    Saved {lastSaved.toLocaleTimeString()}
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
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 gap-2 h-auto bg-transparent p-0 mb-6">
                        <TabsTrigger value="hero" className="relative">
                            Hero
                            {formErrors.hero && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="marquee" className="relative">
                            Marquee
                            {formErrors.serviceHighlightsMarquee && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="brands" className="relative">
                            Brands
                            {formErrors.trustedByBrands && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="about" className="relative">
                            About
                            {formErrors.aboutPreview && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="portfolio" className="relative">
                            Portfolio
                            {formErrors.portfolioPreview && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="cases" className="relative">
                            Cases
                            {formErrors.caseStudiesPreview && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="areas" className="relative">
                            Areas
                            {formErrors.areasWeServe && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="testimonials" className="relative">
                            Testimonials
                            {formErrors.testimonials && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>

                        <TabsTrigger value="seo" className="relative">
                            SEO
                            {formErrors.seo && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
                        </TabsTrigger>
                        <TabsTrigger value="shared" className="relative bg-primary/10">
                            Shared Content
                            {(formErrors.stats || formErrors.servicesPreview || formErrors.whyChooseUs || formErrors.ourApproach || formErrors.industriesWeServe || formErrors.faqs || formErrors.leadership || formErrors.cta) && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* HERO */}
                    <TabsContent value="hero">
                        <Card>
                            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="hero.badge" label="Badge Text" />

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">Heading Lines (Max 3)</h3>
                                        <Button type="button" size="sm" variant="outline" onClick={() => appendHeadingLine({ text: "", style: "normal" })} disabled={headingLineFields.length >= 3}>
                                            <Plus className="h-4 w-4 mr-2" /> Add
                                        </Button>
                                    </div>
                                    {headingLineFields.map((field, index) => (
                                        <div key={field.id} className="border rounded p-4 space-y-4">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Line {index + 1}</span>
                                                <Button type="button" size="sm" variant="destructive" onClick={() => removeHeadingLine(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormInput control={formControl} name={`hero.headingLines.${index}.text`} label="Text" />
                                            <FormField control={formControl} name={`hero.headingLines.${index}.style`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Style</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="normal">Normal</SelectItem>
                                                            <SelectItem value="stroke">Stroke</SelectItem>
                                                            <SelectItem value="gradient">Gradient</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">Description Paragraphs (Max 5)</h3>
                                        <Button type="button" size="sm" variant="outline" onClick={() => appendParagraph({ text: "" })} disabled={paragraphFields.length >= 5}>
                                            <Plus className="h-4 w-4 mr-2" /> Add
                                        </Button>
                                    </div>
                                    {paragraphFields.map((field, index) => (
                                        <div key={field.id} className="border rounded p-4 space-y-4">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Paragraph {index + 1}</span>
                                                <Button type="button" size="sm" variant="destructive" onClick={() => removeParagraph(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormInput control={formControl} name={`hero.descriptionParagraphs.${index}.text`} label="Text" isTextarea />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">CTA Buttons (Exactly 2)</h3>
                                        <Button type="button" size="sm" variant="outline" onClick={() => appendCtaButton({ text: "", url: "", variant: "primary" })} disabled={ctaButtonFields.length >= 2}>
                                            <Plus className="h-4 w-4 mr-2" /> Add
                                        </Button>
                                    </div>
                                    {ctaButtonFields.map((field, index) => (
                                        <div key={field.id} className="border rounded p-4 space-y-4">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Button {index + 1}</span>
                                                <Button type="button" size="sm" variant="destructive" onClick={() => removeCtaButton(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormInput control={formControl} name={`hero.ctaButtons.${index}.text`} label="Text" />
                                            <FormInput control={formControl} name={`hero.ctaButtons.${index}.url`} label="URL" />
                                            <FormField control={formControl} name={`hero.ctaButtons.${index}.variant`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Variant</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="primary">Primary</SelectItem>
                                                            <SelectItem value="secondary">Secondary</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    ))}
                                </div>

                                <ReferenceSelector
                                    form={form}
                                    fieldName="hero.featuredServices"
                                    items={services}
                                    label="Featured Services"
                                    placeholder="Search services..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="shared">
                        <GlobalSectionsFormTabs form={form} control={formControl} errors={formErrors} services={services} />
                    </TabsContent>

                    {/* MARQUEE */}
                    <TabsContent value="marquee">
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle>Service Highlights Marquee</CardTitle>
                                <Button type="button" size="sm" variant="outline" onClick={() => appendHighlight({ text: "" })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {highlightFields.map((field, index) => (
                                    <div key={field.id} className="border rounded p-4 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Highlight {index + 1}</span>
                                            <Button type="button" size="sm" variant="destructive" onClick={() => removeHighlight(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormInput control={formControl} name={`serviceHighlightsMarquee.highlights.${index}.text`} label="Text" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* BRANDS */}
                    <TabsContent value="brands" className="space-y-6">
                        <SectionHeadingCard control={formControl} baseName="trustedByBrands.sectionHeading" title="Section Heading" />
                        <Card>
                            <CardHeader>
                                <CardTitle>Brand Logos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField control={formControl} name="trustedByBrands.brandLogos" render={({ field }) => (
                                    <BulkImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        label="Brand Logos"
                                    />
                                )} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ABOUT */}
                    <TabsContent value="about" className="space-y-6">
                        <SectionHeadingCard control={formControl} baseName="aboutPreview.sectionHeading" title="About Preview" />

                        {/* Left Descriptions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Left Side Descriptions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {leftDescFields.map((field, index) => (
                                    <div key={field.id} className="border rounded p-4 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Paragraph {index + 1}</span>
                                        </div>
                                        <FormInput control={formControl} name={`aboutPreview.leftDescriptions.${index}.text`} label="Text" isTextarea />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Right Descriptions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Right Side Descriptions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {rightDescFields.map((field, index) => (
                                    <div key={field.id} className="border rounded p-4 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Paragraph {index + 1}</span>
                                        </div>
                                        <FormInput control={formControl} name={`aboutPreview.rightDescriptions.${index}.text`} label="Text" isTextarea />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* CTA Button */}
                        <Card>
                            <CardHeader><CardTitle>Call to Action</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormInput control={formControl} name="aboutPreview.ctaText" label="Button Text" />
                                <FormInput control={formControl} name="aboutPreview.ctaUrl" label="Button URL" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* PORTFOLIO */}
                    <TabsContent value="portfolio" className="space-y-6">
                        <SectionHeadingCard control={formControl} baseName="portfolioPreview.sectionHeading" title="Portfolio Preview" />
                        <Card>
                            <CardHeader><CardTitle>Portfolio Projects</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Individual projects are managed separately in the <strong>Portfolio</strong> section.
                                    You can manually select and order which projects appear in this section below.
                                </p>

                                <ReferenceSelector
                                    form={form}
                                    fieldName="portfolioPreview.featuredProjects"
                                    items={projects}
                                    label="Featured Projects"
                                    placeholder="Search projects..."
                                />

                                <div className="grid gap-4 pt-4 border-t">
                                    <h4 className="font-medium text-sm">Call to Action Button</h4>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <FormInput control={formControl} name="portfolioPreview.buttonText" label="Button Text" />
                                        <FormInput control={formControl} name="portfolioPreview.buttonUrl" label="Button URL" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CASES */}
                    <TabsContent value="cases" className="space-y-6">
                        <SectionHeadingCard control={formControl} baseName="caseStudiesPreview.sectionHeading" title="Case Studies Preview" />
                        <Card>
                            <CardHeader><CardTitle>Case Studies</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Detailed case studies are managed separately. You can manually select which case studies (projects with case study details) to feature here.
                                </p>

                                <ReferenceSelector
                                    form={form}
                                    fieldName="caseStudiesPreview.featuredCaseStudies"
                                    items={caseStudies}
                                    label="Featured Case Studies"
                                    placeholder="Search case studies..."
                                />

                                <div className="grid gap-4 pt-4 border-t">
                                    <h4 className="font-medium text-sm">Call to Action Button</h4>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <FormInput control={formControl} name="caseStudiesPreview.buttonText" label="Button Text" />
                                        <FormInput control={formControl} name="caseStudiesPreview.buttonUrl" label="Button URL" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* AREAS */}
                    <TabsContent value="areas" className="space-y-6">
                        <SectionHeadingCard control={formControl} baseName="areasWeServe.sectionHeading" title="Areas We Serve" />
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle>Regions</CardTitle>
                                <Button type="button" size="sm" variant="outline" onClick={() => appendArea({
                                    region: "",
                                    locations: [""],
                                    featured: false,
                                    clients: 0,
                                    flag: ""
                                })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Region
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {areaFields.map((field, index) => (
                                    <div key={field.id} className="border rounded p-4 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Region {index + 1}</span>
                                            <Button type="button" size="sm" variant="destructive" onClick={() => removeArea(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <FormInput control={formControl} name={`areasWeServe.areas.${index}.region`} label="Region Name" />

                                        <FormField control={formControl} name={`areasWeServe.areas.${index}.flag`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Flag Emoji</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="🇺🇸 🇬🇧 🇵🇰" maxLength={10} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={formControl} name={`areasWeServe.areas.${index}.clients`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Number of Clients</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} min={0} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <FormField control={formControl} name={`areasWeServe.areas.${index}.featured`} render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">Featured</FormLabel>
                                                        <div className="text-sm text-muted-foreground">Mark as featured region</div>
                                                    </div>
                                                    <FormControl>
                                                        <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4" />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TESTIMONIALS */}
                    <TabsContent value="testimonials" className="space-y-6">
                        <SectionHeadingCard control={formControl} baseName="testimonials.sectionHeading" title="Testimonials" />
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle>Testimonials</CardTitle>
                                <Button type="button" size="sm" variant="outline" onClick={() => appendTestimonial({ quote: "", author: "", role: "", company: "", avatar: null })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {testimonialFields.map((field, index) => (
                                    <div key={field.id} className="border rounded p-4 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Testimonial {index + 1}</span>
                                            <Button type="button" size="sm" variant="destructive" onClick={() => removeTestimonial(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormInput control={formControl} name={`testimonials.testimonials.${index}.quote`} label="Quote" isTextarea />
                                        <FormInput control={formControl} name={`testimonials.testimonials.${index}.author`} label="Author" />
                                        <FormInput control={formControl} name={`testimonials.testimonials.${index}.role`} label="Role" />
                                        <FormInput control={formControl} name={`testimonials.testimonials.${index}.company`} label="Company" />

                                        <div className="space-y-2">
                                            <FormLabel>Avatar Image</FormLabel>
                                            <FormField control={formControl} name={`testimonials.testimonials.${index}.avatar`} render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ImageUpload
                                                            value={field.value}
                                                            onChange={(asset) => {
                                                                if (!asset) {
                                                                    field.onChange(null)
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
                                                            label=""
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* SEO */}
                    <TabsContent value="seo">
                        <SeoFormTab control={formControl} />
                    </TabsContent>

                </Tabs>
            </form>
        </Form>
    )
}

function getDefaultValues(): CombinedValues {
    return {
        hero: { badge: "", headingLines: [], descriptionParagraphs: [], ctaButtons: [], featuredServices: [] },
        servicesPreview: { sectionHeading: { eyebrow: "", title: "", description: "" }, buttonText: "", buttonUrl: "" },
        portfolioPreview: { sectionHeading: { eyebrow: "", title: "", description: "" }, buttonText: "", buttonUrl: "" },
        aboutPreview: {
            sectionHeading: { eyebrow: "", title: "", description: "" },
            leftDescriptions: [
                { text: "" },
                { text: "" }
            ],
            rightDescriptions: [
                { text: "" },
                { text: "" }
            ],
            ctaText: "",
            ctaUrl: ""
        },
        stats: {
            since: { value: "", label: "" },
            projectsDelivered: { value: "", label: "", suffix: "" },
            yearsExperience: { value: "", label: "", suffix: "" },
            clientSatisfaction: { value: "", label: "", suffix: "" },
        },
        whyChooseUs: { sectionHeading: { eyebrow: "", title: "", description: "" }, benefits: [] },

        faqs: { sectionHeading: { eyebrow: "", title: "", description: "" }, faqItems: [] },
        serviceHighlightsMarquee: { highlights: [] },
        trustedByBrands: { sectionHeading: { eyebrow: "", title: "", description: "" }, brandLogos: [] },
        ourApproach: { sectionHeading: { eyebrow: "", title: "", description: "" }, steps: [] },
        caseStudiesPreview: { sectionHeading: { eyebrow: "", title: "", description: "" }, featuredCaseStudies: [], buttonText: "", buttonUrl: "" },
        areasWeServe: { sectionHeading: { eyebrow: "", title: "", description: "" }, areas: [] },
        industriesWeServe: { sectionHeading: { eyebrow: "", title: "", description: "" }, industries: [] },
        testimonials: { sectionHeading: { eyebrow: "", title: "", description: "" }, testimonials: [] },
        leadership: {
            sectionHeading: { eyebrow: "", title: "", description: "" },
            founder: { name: "", role: "", image: null, socialLinks: [] },
            agencyStructure: []
        },
        cta: {
            badge: "",
            heading: "",
            description: "",
            benefits: [],
        },
        seo: {
            metaTitle: "",
            metaDescription: "",
            focusKeyword: "",
            relatedKeywords: [],
            schemas: []
        }
    } as CombinedValues
}

const ls = (val: any) => typeof val === 'object' ? (val?.en || "") : (val || "");

function mergeWithDefaults(data: any): CombinedValues {
    const defaults = getDefaultValues()
    return {
        ...data,
        hero: {
            ...defaults.hero,
            ...data.hero,
            featuredServices: data.hero?.featuredServices || []
        },
        servicesPreview: {
            ...defaults.servicesPreview,
            ...data.servicesPreview,
            buttonText: data.servicesPreview?.buttonText || defaults.servicesPreview.buttonText,
            buttonUrl: data.servicesPreview?.buttonUrl || defaults.servicesPreview.buttonUrl
        },
        portfolioPreview: {
            ...defaults.portfolioPreview,
            ...data.portfolioPreview,
            buttonText: data.portfolioPreview?.buttonText || defaults.portfolioPreview.buttonText,
            buttonUrl: data.portfolioPreview?.buttonUrl || defaults.portfolioPreview.buttonUrl
        },
        aboutPreview: {
            sectionHeading: { ...defaults.aboutPreview.sectionHeading, ...data.aboutPreview?.sectionHeading },
            leftDescriptions: data.aboutPreview?.leftDescriptions?.length > 0 ? data.aboutPreview.leftDescriptions : defaults.aboutPreview.leftDescriptions,
            rightDescriptions: data.aboutPreview?.rightDescriptions?.length > 0 ? data.aboutPreview.rightDescriptions : defaults.aboutPreview.rightDescriptions,
            ctaText: data.aboutPreview?.ctaText || defaults.aboutPreview.ctaText,
            ctaUrl: data.aboutPreview?.ctaUrl || defaults.aboutPreview.ctaUrl
        },
        stats: {
            since: { ...defaults.stats.since, ...data.stats?.since },
            projectsDelivered: { ...defaults.stats.projectsDelivered, ...data.stats?.projectsDelivered },
            yearsExperience: { ...defaults.stats.yearsExperience, ...data.stats?.yearsExperience },
            clientSatisfaction: { ...defaults.stats.clientSatisfaction, ...data.stats?.clientSatisfaction },
        },
        whyChooseUs: {
            sectionHeading: { ...defaults.whyChooseUs.sectionHeading, ...data.whyChooseUs?.sectionHeading },
            benefits: data.whyChooseUs?.benefits || defaults.whyChooseUs.benefits
        },
        faqs: {
            sectionHeading: { ...defaults.faqs.sectionHeading, ...data.faqs?.sectionHeading },
            faqItems: data.faqs?.faqItems || defaults.faqs.faqItems,
            ...(data.faqs?.buttonText && { buttonText: data.faqs.buttonText }),
            ...(data.faqs?.buttonUrl && { buttonUrl: data.faqs.buttonUrl })
        },
        serviceHighlightsMarquee: { ...defaults.serviceHighlightsMarquee, ...data.serviceHighlightsMarquee },
        trustedByBrands: {
            sectionHeading: { ...defaults.trustedByBrands.sectionHeading, ...data.trustedByBrands?.sectionHeading },
            brandLogos: data.trustedByBrands?.brandLogos || defaults.trustedByBrands.brandLogos
        },
        ourApproach: {
            sectionHeading: { ...defaults.ourApproach.sectionHeading, ...data.ourApproach?.sectionHeading },
            steps: data.ourApproach?.steps || defaults.ourApproach.steps
        },
        caseStudiesPreview: {
            sectionHeading: { ...defaults.caseStudiesPreview.sectionHeading, ...data.caseStudiesPreview?.sectionHeading },
            featuredCaseStudies: data.caseStudiesPreview?.featuredCaseStudies || [],
            buttonText: data.caseStudiesPreview?.buttonText || defaults.caseStudiesPreview.buttonText,
            buttonUrl: data.caseStudiesPreview?.buttonUrl || defaults.caseStudiesPreview.buttonUrl
        },
        areasWeServe: {
            sectionHeading: { ...defaults.areasWeServe.sectionHeading, ...data.areasWeServe?.sectionHeading },
            areas: data.areasWeServe?.areas || defaults.areasWeServe.areas
        },
        industriesWeServe: {
            sectionHeading: { ...defaults.industriesWeServe.sectionHeading, ...data.industriesWeServe?.sectionHeading },
            industries: data.industriesWeServe?.industries || defaults.industriesWeServe.industries
        },
        testimonials: {
            sectionHeading: { ...defaults.testimonials.sectionHeading, ...data.testimonials?.sectionHeading },
            testimonials: data.testimonials?.testimonials || defaults.testimonials.testimonials
        },
        leadership: {
            sectionHeading: { ...defaults.leadership.sectionHeading, ...data.leadership?.sectionHeading },
            founder: {
                ...defaults.leadership.founder,
                ...data.leadership?.founder,
                name: ls(data.leadership?.founder?.name),
                role: ls(data.leadership?.founder?.role),
                socialLinks: (data.leadership?.founder?.socialLinks || []).map((link: any) => ({
                    ...link,
                    iconName: link.iconName || "linkedin",
                    label: ls(link.label),
                    url: link.url || ""
                }))
            },
            agencyStructure: data.leadership?.agencyStructure || defaults.leadership.agencyStructure
        },
        cta: {
            badge: data.cta?.badge || defaults.cta.badge,
            heading: data.cta?.heading || defaults.cta.heading,
            description: data.cta?.description || defaults.cta.description,
            benefits: data.cta?.benefits || defaults.cta.benefits,
        },
        seo: {
            ...defaults.seo,
            ...data.seo,
            relatedKeywords: data.seo?.relatedKeywords || defaults.seo?.relatedKeywords || [],
            schemas: data.seo?.schemas || defaults.seo?.schemas || []
        }
    } as CombinedValues
}
