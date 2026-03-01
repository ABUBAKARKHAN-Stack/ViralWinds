"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { portfolioPageContentSchema, PortfolioPageContentValues } from "@/lib/validations/portfolio-page-content"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormInput } from "@/components/admin/form/FormInput"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SeoFormTab } from "./SeoFormTab"
import { updatePortfolioPageContent, savePortfolioPageDraft } from "@/app/actions/portfolioPageContent"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Spinner } from "@/components/ui/spinner"
import { Save, AlertCircle, Clock, Trash2, Search, CheckCircle2 } from "lucide-react"
import { debounce } from "lodash"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface PortfolioPageContentFormProps {
    initialData?: any
    hasDraft?: boolean
    draftUpdatedAt?: string | null
    projects: { _id: string, title: string }[]
    forms: { _id: string, name: string }[]
}

export function PortfolioPageContentForm({ initialData, hasDraft, draftUpdatedAt, projects, forms }: PortfolioPageContentFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(
        draftUpdatedAt ? new Date(draftUpdatedAt) : null
    )
    const [isInitialMount, setIsInitialMount] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    const form = useForm<PortfolioPageContentValues>({
        resolver: zodResolver(portfolioPageContentSchema),
        defaultValues: mergeWithDefaults(initialData),
    })

    const formControl = form.control as any

    const saveDraft = useCallback(
        debounce(async (data: Partial<PortfolioPageContentValues>) => {
            if (isInitialMount) return
            setIsSavingDraft(true)
            try {
                const result = await savePortfolioPageDraft(data)
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
            saveDraft(value as Partial<PortfolioPageContentValues>)
        })
        return () => subscription.unsubscribe()
    }, [form, saveDraft])

    async function onSubmit(values: PortfolioPageContentValues) {
        setIsLoading(true)
        try {
            const result = await updatePortfolioPageContent(values)
            if (result.success) {
                successToast("Portfolio page content updated successfully")
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
    const filteredProjects = projects.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedProjectIds = form.watch("portfolioList.projects") || []

    const toggleProject = (projectId: string) => {
        const current = [...selectedProjectIds]
        const index = current.indexOf(projectId)
        if (index > -1) {
            current.splice(index, 1)
        } else {
            current.push(projectId)
        }
        form.setValue("portfolioList.projects", current, { shouldValidate: true })
    }

    const moveProject = (index: number, direction: 'up' | 'down') => {
        const current = [...selectedProjectIds]
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= current.length) return

        const temp = current[index]
        current[index] = current[newIndex]
        current[newIndex] = temp
        form.setValue("portfolioList.projects", current, { shouldValidate: true })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-20 bg-background/95 backdrop-blur py-4 border-b">
                    <div>
                        <h1 className="text-2xl font-bold">Portfolio Page Content</h1>
                        <div className="flex items-center gap-3 text-muted-foreground text-sm mt-1">
                            <p>Manage hero and manually selected projects.</p>
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
                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Content
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="hero" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="hero" className="relative">
                            Hero Section
                            {!!formErrors.hero && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="relative">
                            Project List
                            {!!formErrors.portfolioList && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="cta" className="relative">
                            CTA Section
                            {!!formErrors.cta && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="seo" className="relative">
                            SEO
                            {!!formErrors.seo && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="hero" className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Hero Configuration</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="hero.title" label="Title" />
                                <FormInput control={formControl} name="hero.subtitle" label="Subtitle" />
                                <FormInput control={formControl} name="hero.description" label="Description" isTextarea />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Manually Select Projects</CardTitle></CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search projects..."
                                            className="pl-9"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="border rounded-md p-4 h-[400px] overflow-y-auto space-y-2">
                                        {projects.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                                                <div className="p-3 bg-muted rounded-full">
                                                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium">No Projects Found</p>
                                                    <p className="text-xs text-muted-foreground">You haven't created any projects yet.</p>
                                                </div>
                                                <Button asChild variant="outline" size="sm">
                                                    <a href="/admin/portfolio/new">Create First Project</a>
                                                </Button>
                                            </div>
                                        ) : filteredProjects.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                                                <Search className="h-8 w-8 mb-2 opacity-20" />
                                                <p className="text-sm">No projects match your search</p>
                                            </div>
                                        ) : (
                                            filteredProjects.map(project => (
                                                <div key={project._id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors border">
                                                    <Checkbox
                                                        id={project._id}
                                                        checked={selectedProjectIds.includes(project._id)}
                                                        onCheckedChange={() => toggleProject(project._id)}
                                                    />
                                                    <label htmlFor={project._id} className="text-sm font-medium flex-1 cursor-pointer">
                                                        {project.title}
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold px-1">Selected Order ({selectedProjectIds.length})</h3>
                                        {selectedProjectIds.length > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive"
                                                onClick={() => form.setValue("portfolioList.projects", [])}
                                            >
                                                Clear All
                                            </Button>
                                        )}
                                    </div>
                                    <div className="border rounded-md p-4 h-[400px] overflow-y-auto space-y-2 bg-muted/20">
                                        {selectedProjectIds.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-8">
                                                <CheckCircle2 className="h-12 w-12 mb-2 opacity-20" />
                                                <p>No projects selected yet.</p>
                                                <p className="text-xs">Selected projects will appear here in their display order.</p>
                                            </div>
                                        ) : (
                                            selectedProjectIds.map((id, index) => {
                                                const project = projects.find(p => p._id === id)
                                                return (
                                                    <div key={id} className="flex items-center gap-2 p-3 bg-background border rounded-lg shadow-sm">
                                                        <span className="text-xs font-bold text-muted-foreground w-6">#{index + 1}</span>
                                                        <span className="flex-1 text-sm font-medium truncate">{project?.title || "Unknown Project"}</span>
                                                        <div className="flex gap-1">
                                                            <ArrowUpButton onClick={() => moveProject(index, 'up')} disabled={index === 0} />
                                                            <ArrowDownButton onClick={() => moveProject(index, 'down')} disabled={index === selectedProjectIds.length - 1} />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-destructive"
                                                                onClick={() => toggleProject(id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                    <FormMessage>{form.formState.errors.portfolioList?.projects?.message}</FormMessage>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="cta" className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Call to Action Configuration</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="cta.sectionHeading.eyebrow" label="Eyebrow" />
                                <FormInput control={formControl} name="cta.sectionHeading.title" label="Title" />
                                <FormInput control={formControl} name="cta.sectionHeading.description" label="Description" isTextarea />

                                <FormField
                                    control={form.control}
                                    name="cta.formReference"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Form</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose a form to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {forms.map(f => (
                                                        <SelectItem key={f._id} value={f._id}>{f.name}</SelectItem>
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

                    <TabsContent value="seo">
                        <SeoFormTab control={formControl} />
                    </TabsContent>
                </Tabs>
            </form>
        </Form >
    )
}

function ArrowUpButton({ onClick, disabled }: { onClick: () => void, disabled?: boolean }) {
    return (
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={disabled} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m18 15-6-6-6 6" />
            </svg>
        </Button>
    )
}

function ArrowDownButton({ onClick, disabled }: { onClick: () => void, disabled?: boolean }) {
    return (
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={disabled} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </Button>
    )
}

function getDefaultValues(): PortfolioPageContentValues {
    return {
        hero: {
            title: "",
            subtitle: "",
            description: "",
        },
        portfolioList: {
            projects: [],
        },
        cta: {
            sectionHeading: {
                eyebrow: "",
                title: "",
                description: "",
            },
            formReference: "",
        },
        seo: {
            metaTitle: "",
            metaDescription: "",
            focusKeyword: "",
            relatedKeywords: [],
            schemas: []
        }
    } as PortfolioPageContentValues
}

function mergeWithDefaults(data: any): PortfolioPageContentValues {
    const defaults = getDefaultValues()
    if (!data) return defaults

    return {
        ...defaults,
        ...data,
        hero: {
            ...defaults.hero,
            ...data.hero
        },
        portfolioList: {
            ...defaults.portfolioList,
            ...data.portfolioList,
            projects: data.portfolioList?.projects || defaults.portfolioList.projects
        },
        cta: {
            ...defaults.cta,
            ...data.cta,
            sectionHeading: {
                ...defaults.cta?.sectionHeading,
                ...data.cta?.sectionHeading
            },
            formReference: data.cta?.formReference || defaults.cta?.formReference
        },
        seo: {
            ...defaults.seo,
            ...data.seo,
            relatedKeywords: data.seo?.relatedKeywords || defaults.seo?.relatedKeywords || [],
            schemas: data.seo?.schemas || defaults.seo?.schemas || []
        }
    } as PortfolioPageContentValues
}
