"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { blogPostSchema, BlogPostValues } from "@/lib/validations/blog"
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
import { createPost, updatePost } from "@/app/actions/blog"
import { saveBlogDraft } from "@/app/actions/blogDraftActions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SeoFormTab } from "@/components/admin/form/SeoFormTab"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CustomPortableTextEditor } from "@/components/admin/form/PortableTextEditor"
import { FormInput } from "@/components/admin/form/FormInput"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { debounce } from "lodash"
import { ArrowLeft } from "lucide-react"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Spinner } from "@/components/ui/spinner"
import { ImageUpload } from "@/components/admin/form/ImageUpload"
import { CommaKeywordsInput } from "@/components/admin/form/CommaKeywordsInput"

interface BlogFormProps {
    initialData?: BlogPostValues & { _id?: string }
    services: { _id: string; title: string }[]
    categories: { _id: string; title: string }[]
    locations: { _id: string; title: string }[]
    blogId?: string
    hasDraft?: boolean
    draftUpdatedAt?: string | null
}

export function BlogForm({
    initialData,
    services,
    categories,
    locations,
    blogId,
    draftUpdatedAt
}: BlogFormProps) {
    const isPublished = initialData?._id && !initialData._id.startsWith('drafts.')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [currentBlogId] = useState(blogId)
    const [lastSaved, setLastSaved] = useState<Date | null>(
        draftUpdatedAt ? new Date(draftUpdatedAt) : null
    )
    const [isInitialMount, setIsInitialMount] = useState(true)
    const isSubmittingRef = useRef(false)


    const form = useForm<BlogPostValues>({
        resolver: zodResolver(blogPostSchema),
        defaultValues: initialData ? {
            ...initialData,
            slug: initialData.slug || { current: "" },
            categories: initialData.categories?.map((cat: any) => typeof cat === 'string' ? cat : (cat._ref || cat._id)) || [],
            body: initialData.body?.map((block: any) => {
                if (block.children && !block._type) {
                    return { ...block, _type: 'block' };
                }
                return block;
            }) || [],
            tags: Array.isArray((initialData as any).tags) ? (initialData as any).tags : (typeof (initialData as any).tags === 'string' ? ((initialData as any).tags as string).split(',').map((t: string) => t.trim()).filter(Boolean) : []),
            service: (initialData.service as any)?._ref || (initialData.service as any)?._id || (typeof initialData.service === 'string' ? initialData.service : "none"),
            locations: initialData.locations?.map((loc: any) => typeof loc === 'string' ? loc : (loc._ref || loc._id)) || [],
            mainImage: initialData.mainImage?._id ? initialData.mainImage : (initialData.mainImage?.asset?._ref ? { _id: initialData.mainImage.asset._ref, url: initialData.mainImage.url } : initialData.mainImage),
        } : {
            title: "",
            description: "",
            slug: { current: "" },
            publishedAt: new Date().toISOString(),
            featured: false,
            author: "Abdul Samad",
            tags: [],
            categories: categories
                .filter(cat => cat.title?.toLowerCase() === 'all')
                .map(cat => cat._id),
            body: [],
            service: "none",
            locations: []
        },
    })
    
    const saveDraft = useCallback(
        debounce(async (data: Partial<BlogPostValues>) => {
            if (isInitialMount || !currentBlogId || isSubmittingRef.current) return
            setIsSavingDraft(true)
            try {
                const result = await saveBlogDraft(currentBlogId, data)
                if (result.success) {
                    setLastSaved(new Date())
                    if (!initialData?._id && typeof window !== 'undefined') {
                        const newUrl = `/admin/blogs/edit/${currentBlogId}`
                        if (window.location.pathname !== newUrl) {
                            router.replace(newUrl, { scroll: false })
                        }
                    }
                }
            } catch (error) {
                console.error("Draft save failed:", error)
            } finally {
                setIsSavingDraft(false)
            }
        }, 2000),
        [isInitialMount, currentBlogId, initialData, router]
    )

    useEffect(() => {
        const timer = setTimeout(() => setIsInitialMount(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const subscription = form.watch((value) => {
            saveDraft(value as Partial<BlogPostValues>)
        })
        return () => {
            subscription.unsubscribe()
            saveDraft.cancel()
        }
    }, [form, saveDraft])

    const title = form.watch("title")
    const currentSlug = form.watch("slug.current")
    useEffect(() => {
        if (!isPublished && title && !currentSlug) {
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            form.setValue("slug.current", slug)
        }
    }, [title, isPublished, form, currentSlug])

    function onSubmit(values: BlogPostValues) {
        saveDraft.cancel()
        isSubmittingRef.current = true

        startTransition(async () => {
            try {
                const result = (isPublished
                    ? await updatePost(initialData!._id!, values)
                    : await createPost(values, currentBlogId)) as any

                if (result.success) {
                    successToast(`Post ${isPublished ? 'updated' : 'published'} successfully`)
                    router.push('/admin/blogs')
                    router.refresh()
                } else {
                    errorToast(result.error || "Failed to save post")
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
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-20 bg-background/95 backdrop-blur py-4 border-b">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon" className="rounded-full">
                            <Link href="/admin/blogs">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">{isPublished ? `Edit: ${initialData.title || 'Untitled'}` : (initialData?._id ? "Edit Draft" : "Create New Post")}</h1>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground min-h-[20px]">
                                {isSavingDraft && (
                                    <span className="flex items-center gap-1 text-yellow-600">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Saving draft...
                                    </span>
                                )}
                                {!isSavingDraft && lastSaved && (
                                    <span className="flex items-center gap-1 text-green-600">
                                        <Save className="h-3 w-3" />
                                        Draft saved {lastSaved.toLocaleTimeString()}
                                    </span>
                                )}
                                {!isSavingDraft && !lastSaved && (
                                    <span>{isPublished ? "Update your blog post details." : "Compose a new insight or article."}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <Button type="submit" disabled={isPending} className="min-w-[140px]">
                            {isPending ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            {isPublished ? "Update Post" : "Publish Post"}
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="categorization">Categorization & Locations</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Content Details</CardTitle>
                                        <CardDescription>Main information about the post.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormInput
                                            control={form.control}
                                            name="title"
                                            label="Post Title"
                                            placeholder="Enter post title"
                                        />
                                        <FormInput
                                            control={form.control}
                                            name="description"
                                            label="Short Description"
                                            isTextarea
                                            placeholder="Enter a brief summary"
                                        />
                                        <FormField
                                            control={form.control}
                                            name="slug.current"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Slug <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <div className="flex gap-2">
                                                            <Input {...field} value={field.value || ''} placeholder="auto-generated-slug" />
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
                                                    <FormDescription>Unique URL identifier.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="readTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Read Time (min)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                                                                placeholder="e.g. 5"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="author"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Author Name <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g. Abdul Samad" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <CommaKeywordsInput
                                            name="tags"
                                            label="Tags"
                                            placeholder="Type keyword and press comma or enter..."
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className={cn(form.formState.errors.body && "text-destructive")}>Body Content <span className="text-destructive">*</span></CardTitle>
                                    </CardHeader>
                                    <CardContent className={cn("p-0", form.formState.errors.body && "border-2 border-destructive/20 rounded-b-lg")}>
                                        <FormField
                                            control={form.control}
                                            name="body"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <CustomPortableTextEditor
                                                            value={field.value || []}
                                                            setValue={(newValue) => field.onChange(newValue)}
                                                        />
                                                    </FormControl>
                                                    <div className="p-4 pt-0">
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Featured Image</CardTitle>
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
                                                            label="Blog Header Image"
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

                    <TabsContent value="categorization" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Services & Categories</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="service"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Related Service</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a service" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="none">None</SelectItem>
                                                            {services.map((service) => (
                                                                <SelectItem key={service._id} value={service._id}>
                                                                    {service.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="categories"
                                            render={() => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel className="text-base">Categories</FormLabel>
                                                    </div>
                                                    {categories.length === 0 ? (
                                                        <div className="text-sm text-muted-foreground italic py-2">
                                                            No categories found.
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            {categories.map((category) => (
                                                                <FormField
                                                                    key={category._id}
                                                                    control={form.control}
                                                                    name="categories"
                                                                    render={({ field }) => (
                                                                        <FormItem
                                                                            key={category._id}
                                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                                        >
                                                                            <FormControl>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                                                    checked={Array.isArray(field.value) && field.value.includes(category._id)}
                                                                                    onChange={(e) => {
                                                                                        const checked = e.target.checked
                                                                                        const current = Array.isArray(field.value) ? field.value : []

                                                                                        return checked
                                                                                            ? field.onChange([...current, category._id])
                                                                                            : field.onChange(
                                                                                                current.filter(
                                                                                                    (value) => value !== category._id
                                                                                                )
                                                                                            )
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="font-normal cursor-pointer text-sm">
                                                                                {category.title}
                                                                            </FormLabel>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Multiple Locations</CardTitle>
                                        <CardDescription>Select all locations this post applies to.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="locations"
                                            render={() => (
                                                <FormItem>
                                                    {locations.length === 0 ? (
                                                        <div className="text-sm text-muted-foreground italic py-2">
                                                            No locations found.
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            {locations.map((location) => (
                                                                <FormField
                                                                    key={location._id}
                                                                    control={form.control}
                                                                    name="locations"
                                                                    render={({ field }) => (
                                                                        <FormItem
                                                                            key={location._id}
                                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                                        >
                                                                            <FormControl>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                                                    checked={Array.isArray(field.value) && field.value.includes(location._id)}
                                                                                    onChange={(e) => {
                                                                                        const checked = e.target.checked
                                                                                        const current = Array.isArray(field.value) ? field.value : []

                                                                                        return checked
                                                                                            ? field.onChange([...current, location._id])
                                                                                            : field.onChange(
                                                                                                current.filter(
                                                                                                    (value) => value !== location._id
                                                                                                )
                                                                                            )
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="font-normal cursor-pointer text-sm">
                                                                                {location.title}
                                                                            </FormLabel>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Publishing Options</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="featured"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-none">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm">Featured Post</FormLabel>
                                                        <FormDescription className="text-xs">
                                                            Pin to the top of the blog page.
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="publishedAt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Publish Date</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            {...field}
                                                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                                            onChange={(e) => {
                                                                const date = new Date(e.target.value)
                                                                field.onChange(date.toISOString())
                                                            }}
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

                    <TabsContent value="seo">
                        <SeoFormTab control={form.control} />
                    </TabsContent>
                </Tabs>
            </form >
        </Form >
    )
}
