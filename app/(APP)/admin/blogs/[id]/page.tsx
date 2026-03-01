import { getPostForView } from "@/app/actions/blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Eye, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { LinkProcessor } from "@/components/ui/LinkProcessor"

interface BlogViewPageProps {
    params: Promise<{ id: string }>
}

export default async function BlogViewPage({ params }: BlogViewPageProps) {
    const { id } = await params
    const post = await getPostForView(id)

    if (!post) {
        notFound()
    }    

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <Button variant="ghost" size="sm" asChild className="shrink-0 p-0 sm:p-2 sm:h-9 sm:px-4">
                        <Link href="/admin/blogs">
                            <ArrowLeft className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                    </Button>
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-2xl sm:text-3xl font-bold truncate flex-1">{post.displayTitle}</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            {post.featured && (
                                <span className="flex mt-0.5 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-500/20">
                                    <Star className="h-2.5 w-2.5 fill-current" />
                                    Featured Post
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {post.slug && (
                        <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none h-9">
                            <Link href={`/en/blog/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </Link>
                        </Button>
                    )}
                    <Button size="sm" asChild className="flex-1 sm:flex-none h-9">
                        <Link href={`/admin/blogs/edit/${post._id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 overflow-hidden border-none shadow-md bg-linear-to-br from-card to-muted/20">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            Post Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative w-full h-64 rounded-xl overflow-hidden bg-muted border shadow-inner group">
                            {post.mainImageUrl ? (
                                <Image
                                    src={post.mainImageUrl}
                                    alt={post.displayTitle}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                    <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                                        <Eye className="h-6 w-6 opacity-20" />
                                    </div>
                                    <span className="text-sm font-medium">No featured image uploaded</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Description</h3>
                            <div className={cn(
                                "text-muted-foreground leading-relaxed whitespace-pre-wrap",
                                !post.displayDescription && "text-muted-foreground/30 italic"
                            )}>
                                {post.displayDescription ? <LinkProcessor text={post.displayDescription} /> : "No description provided for this post."}
                            </div>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag: string, i: number) => (
                                        <span key={i} className="px-2.5 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground border">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-linear-to-br from-card to-muted/10">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            Details & Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <DetailRow label="Slug" value={post.slug} isCode />
                        <DetailRow label="ID" value={post._id} isCode />
                        <div className="relative">
                            <DetailRow label="Status" value={post.status} isBadge />
                            {post.status === 'Draft' && post.hasPublished && (
                                <span className="absolute right-0 bottom-0 text-[9px] text-amber-600 font-medium animate-pulse">
                                    Has unpublished changes
                                </span>
                            )}
                        </div>
                        <DetailRow label="Author" value={post.author} />
                        <DetailRow label="Read Time" value={post.readTime ? `${post.readTime} min` : undefined} />
                        <DetailRow label="Featured" value={post.featured ? "Yes" : "No"} />
                        <DetailRow label="Created" value={new Date(post._createdAt).toLocaleDateString()} />
                        <DetailRow label="Updated" value={new Date(post._updatedAt).toLocaleDateString()} />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Blog Configuration Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        <SectionStatus
                            label="Content Body"
                            isActive={!!post.body?.length}
                        />
                        <SectionStatus
                            label="Main Image"
                            isActive={!!post.mainImageUrl}
                        />
                        <SectionStatus
                            label="SEO"
                            isActive={!!(post.seo?.metaTitle && post.seo?.metaDescription)}
                        />
                        <SectionStatus
                            label="Tags"
                            isActive={!!(post.tags && post.tags.length > 0)}
                            count={post.tags?.length}
                        />
                        <SectionStatus
                            label="Featured"
                            isActive={true}
                            activeLabel={post.featured ? "Featured Post" : "Standard Post"}
                            variant="optional"
                        />
                        <SectionStatus
                            label="Location"
                            isActive={!!(post.locations && post.locations.length > 0)}
                            activeLabel={`${post.locations?.length || 0} Locations`}
                            inactiveLabel="Global"
                            variant="optional"
                        />
                        <SectionStatus
                            label="Linked Service"
                            isActive={!!post.service}
                            activeLabel={typeof post.service === 'string' ? post.service : post.service?.title}
                            inactiveLabel="General Blog"
                            variant="optional"
                        />
                        <SectionStatus
                            label="Categories"
                            isActive={!!(post.categories && post.categories.length > 0)}
                            count={post.categories?.length}
                            activeLabel={`${post.categories?.length || 0} Categories`}
                            inactiveLabel="Uncategorized"
                            variant="optional"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function DetailRow({ label, value, isCode = false, isBadge = false }: { label: string, value?: string | number, isCode?: boolean, isBadge?: boolean }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-muted last:border-0 hover:bg-muted/10 px-2 rounded-lg transition-colors group">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            {isBadge ? (
                <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                    value === 'Published' ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                )}>
                    {value}
                </span>
            ) : isCode ? (
                <code className="text-xs bg-muted/80 px-2 py-1 rounded font-mono text-primary/80 border transition-colors group-hover:bg-muted group-hover:border-primary/20">{value || "None"}</code>
            ) : (
                <span className="text-sm font-semibold">{value || "N/A"}</span>
            )}
        </div>
    )
}

function SectionStatus({
    label,
    isActive,
    count,
    activeLabel = "Configured",
    inactiveLabel = "Missing Content",
    variant = "default"
}: {
    label: string,
    isActive: boolean,
    count?: number,
    activeLabel?: string,
    inactiveLabel?: string,
    variant?: "default" | "optional"
}) {
    // Optional fields use a more subtle style when inactive, rather than destructive red
    const isOptionalInactive = variant === "optional" && !isActive;

    return (
        <div className={cn(
            "flex flex-col gap-2 p-4 border rounded-xl transition-all duration-300 relative overflow-hidden group shadow-sm",
            isActive
                ? "bg-green-50/30 border-green-100 dark:bg-green-500/5 dark:border-green-500/10"
                : isOptionalInactive
                    ? "bg-muted/20 border-muted grayscale opacity-80"
                    : "bg-destructive/10 border-destructive/10 dark:bg-destructive/5 dark:border-destructive/10 grayscale-[0.5] opacity-70"
        )}>
            <div className="flex justify-between items-start z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
                {isActive && count !== undefined && (
                    <span className="text-[10px] font-bold bg-green-500/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-md">
                        {count}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2 z-10">
                <div className={cn(
                    "h-2 w-2 rounded-full",
                    isActive
                        ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                        : isOptionalInactive
                            ? 'bg-muted-foreground/30'
                            : 'bg-destructive'
                )} />
                <span className={cn(
                    "text-xs font-semibold truncate max-w-full",
                    isActive
                        ? "text-green-700 dark:text-green-400"
                        : isOptionalInactive
                            ? "text-muted-foreground"
                            : "text-destructive"
                )}>
                    {isActive ? activeLabel : inactiveLabel}
                </span>
            </div>

            {/* Hover effect background */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                isActive ? "bg-green-500/5" : isOptionalInactive ? "bg-muted/5" : "bg-destructive/5"
            )} />
        </div>
    )
}
