"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, ProjectValues } from "@/lib/validations/project"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useTransition, useCallback, useEffect, useRef } from "react"
import { createProject, updateProject } from "@/app/actions/project"
import { saveProjectDraft } from "@/app/actions/projectDraftActions"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Save, ArrowLeft, Clock, X, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FormInput } from "@/components/admin/form/FormInput"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { debounce } from "lodash"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Spinner } from "@/components/ui/spinner"
import { ImageUpload } from "@/components/admin/form/ImageUpload"
import { IconSelect } from "@/components/admin/form/IconSelect"
import { Separator } from "@/components/ui/separator"
import { CommaKeywordsInput } from "@/components/admin/form/CommaKeywordsInput"
import { SeoFormTab } from "@/components/admin/form/SeoFormTab"

interface ProjectFormProps {
    initialData?: any
    projectId?: string
    isEdit?: boolean
}

export function ProjectForm({
    initialData,
    projectId,
    isEdit = false
}: ProjectFormProps) {
    const isPublished = initialData?._id && !initialData._id.startsWith('drafts.')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [currentProjectId, setCurrentProjectId] = useState(projectId)
    const [lastSaved, setLastSaved] = useState<Date | null>(
        initialData?._updatedAt ? new Date(initialData._updatedAt) : null
    )
    const [isInitialMount, setIsInitialMount] = useState(true)
    const isSubmittingRef = useRef(false)

    const form = useForm<ProjectValues>({
        resolver: zodResolver(projectSchema) as any,
        defaultValues: (initialData as ProjectValues) || {
            title: "",
            slug: { current: "" },
            description: "",
            category: "",
            tags: [],
            caseStudy: {
                title: "",
                testimonial: "",
                results: []
            }
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "caseStudy.results"
    })

    const saveDraft = useCallback(
        debounce(async (data: Partial<ProjectValues>) => {
            if (isInitialMount || isSubmittingRef.current) return
            if (!currentProjectId && !data.title) return

            setIsSavingDraft(true)
            try {
                const result = await saveProjectDraft(currentProjectId, data)
                if (result.success) {
                    setLastSaved(new Date())
                    if (result.id && !currentProjectId) {
                        setCurrentProjectId(result.id)
                        window.history.replaceState(null, '', `/admin/portfolio/edit/${result.id}`)
                    }
                }
            } catch (error) {
                console.error("Draft save failed:", error)
            } finally {
                setIsSavingDraft(false)
            }
        }, 2000),
        [isInitialMount, currentProjectId]
    )

    useEffect(() => {
        const timer = setTimeout(() => setIsInitialMount(false), 500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const subscription = form.watch((value) => {
            saveDraft(value as Partial<ProjectValues>)
        })
        return () => {
            subscription.unsubscribe()
            saveDraft.cancel()
        }
    }, [form, saveDraft])

    function onSubmit(values: ProjectValues) {
        saveDraft.cancel()
        isSubmittingRef.current = true

        startTransition(async () => {
            try {
                const result = (isPublished || isEdit
                    ? await updateProject(projectId!, values)
                    : await createProject(values, currentProjectId)) as any

                if (result.success) {
                    successToast(`Project ${isPublished ? 'updated' : 'published'} successfully`)
                    router.push('/admin/portfolio')
                    router.refresh()
                } else {
                    errorToast(result.error || "Failed to save project")
                    isSubmittingRef.current = false
                }
            } catch (error) {
                errorToast("An unexpected error occurred")
                isSubmittingRef.current = false
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-40 bg-background/95 backdrop-blur-sm py-4 border-b">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon" className="rounded-full">
                            <Link href="/admin/portfolio">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">
                                {isPublished ? `Edit Project` : (projectId ? "Edit Draft" : "Add Project")}
                            </h1>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground min-h-[20px]">
                                {isSavingDraft && (
                                    <span className="flex items-center gap-1 text-blue-600">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Saving...
                                    </span>
                                )}
                                {!isSavingDraft && lastSaved && (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                        <Clock className="h-3 w-3" />
                                        Draft Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <Button type="submit" disabled={isPending} className="min-w-[140px] h-9">
                            {isPending ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            {isPublished ? "Update Project" : "Publish Project"}
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="mb-6 flex w-full h-auto flex-wrap gap-1 p-1 bg-muted/50 rounded-lg justify-start">
                        <TabsTrigger value="general" className="relative px-6 py-2">General Details</TabsTrigger>
                        <TabsTrigger value="casestudy" className="relative px-6 py-2">Case Study / Results</TabsTrigger>
                        <TabsTrigger value="seo" className="relative px-6 py-2">SEO Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Project Details</CardTitle>
                                        <CardDescription>Basic information for the project card.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormInput
                                            control={form.control}
                                            name="title"
                                            label="Project Title"
                                        />
                                        <FormField
                                            control={form.control}
                                            name="slug.current"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Slug <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <div className="flex gap-2">
                                                            <Input {...field} placeholder="auto-generated-slug" />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const genSlug = form.getValues("title").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || ''
                                                                    form.setValue("slug.current", genSlug)
                                                                }}
                                                            >
                                                                Regenerate
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormInput
                                            control={form.control}
                                            name="category"
                                            label="Short Category"
                                            placeholder="e.g. Brand, Digital, UI/UX"
                                        />
                                        <FormInput
                                            control={form.control}
                                            name="description"
                                            label="Description"
                                            isTextarea
                                        />
                                        <CommaKeywordsInput
                                            name="tags"
                                            label="Tags"
                                            placeholder="Type keyword and press comma or enter..."
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Featured Image</CardTitle>
                                        <CardDescription>Main image displayed in the portfolio list.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="mainImage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ImageUpload
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            label="Project Banner"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="casestudy" className="space-y-6">
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-6">
                                <Card >
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Info className="h-5 w-5" />
                                            Case Study Content
                                        </CardTitle>
                                        <CardDescription>Detailed results and testimonials for this project.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <FormInput
                                            control={form.control}
                                            name="caseStudy.title"
                                            label="Case Study Title"
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="caseStudy.beforeImage"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ImageUpload
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                label="Before Image"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="caseStudy.afterImage"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ImageUpload
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                label="After Image"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormInput
                                            control={form.control}
                                            name="caseStudy.testimonial"
                                            label="Client Testimonial"
                                            isTextarea
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Results & Stats</CardTitle>
                                        <CardDescription>Quantitative achievements.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-sm font-semibold">Stats</FormLabel>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => append({ icon: "TrendingUp", value: "", label: "" } as any)}
                                            >
                                                <Plus className="h-4 w-4 mr-2" /> Add Stat
                                            </Button>
                                        </div>
                                        <Separator />

                                        <div className="space-y-6">
                                            {fields.map((item, index) => (
                                                <div key={item.id} className="relative p-4 border rounded-lg bg-muted/30 space-y-4">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-white hover:bg-destructive/90"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`caseStudy.results.${index}.icon` as any}
                                                            render={({ field }) => (
                                                                <IconSelect field={field} type="benefit" label="Icon" />
                                                            )}
                                                        />
                                                        <FormInput
                                                            control={form.control}
                                                            name={`caseStudy.results.${index}.value`}
                                                            label="Stat Value"
                                                            placeholder="+340%"
                                                        />
                                                        <FormInput
                                                            control={form.control}
                                                            name={`caseStudy.results.${index}.label`}
                                                            label="Stat Label"
                                                            placeholder="Revenue Growth"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {fields.length === 0 && (
                                                <p className="text-xs text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                                                    No results added yet.
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-6">
                        <SeoFormTab control={form.control} />
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    )
}
