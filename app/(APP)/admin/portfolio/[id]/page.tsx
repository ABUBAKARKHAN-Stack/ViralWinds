import { getProjectForView } from "@/app/actions/project"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit as EditIcon, Eye, Info, LayoutGrid, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { LinkProcessor } from "@/components/ui/LinkProcessor"

interface ViewProjectPageProps {
    params: Promise<{ id: string }>
}

export default async function ViewProjectPage({ params }: ViewProjectPageProps) {
    const { id } = await params
    const project = await getProjectForView(id)

    if (!project) {
        notFound()
    }

    // Helper to extract localized values safely
    const getVal = (val: any) => typeof val === 'string' ? val : (val?.en || val?.ar || (val && typeof val === 'object' ? Object.values(val)[0] : null));

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <Button variant="ghost" size="sm" asChild className="shrink-0 p-0 sm:p-2 sm:h-9 sm:px-4">
                        <Link href="/admin/portfolio">
                            <ArrowLeft className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                    </Button>
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-2xl sm:text-3xl font-bold truncate flex-1">{project.displayTitle}</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded border capitalize">
                                {project.displayCategory || "General Project"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {project.slug && (
                        <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none h-9">
                            <Link href={`/portfolio/${project.slug}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </Link>
                        </Button>
                    )}
                    <Button size="sm" asChild className="flex-1 sm:flex-none h-9">
                        <Link href={`/admin/portfolio/edit/${project._id}`}>
                            <EditIcon className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-none shadow-md bg-linear-to-br from-card to-muted/20">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                Project Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-muted border shadow-inner group">
                                {project.mainImageUrl ? (
                                    <Image
                                        src={project.mainImageUrl}
                                        alt={project.displayTitle}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                        <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                                            <LayoutGrid className="h-6 w-6 opacity-20" />
                                        </div>
                                        <span className="text-sm font-medium">No featured image uploaded</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Description</h3>
                                <div className={cn(
                                    "text-muted-foreground leading-relaxed whitespace-pre-wrap",
                                    !project.displayDescription && "text-muted-foreground/30 italic"
                                )}>
                                    {project.displayDescription ? <LinkProcessor text={project.displayDescription} /> : "No description provided for this project."}
                                </div>
                            </div>
                            {project.tags && project.tags.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground border">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Case Study Simplified Images */}
                    {project.caseStudy && (
                        <Card className="border-none shadow-md bg-linear-to-br from-card to-muted/10">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary" />
                                    Case Study Images
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            <ImageIcon className="h-3 w-3" /> Before Image
                                        </h4>
                                        <div className="relative aspect-4/3 rounded-lg border overflow-hidden bg-muted group">
                                            {project.caseStudy.beforeImageUrl ? (
                                                <Image src={project.caseStudy.beforeImageUrl} alt="Before" fill className="object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full gap-1 opacity-20">
                                                    <ImageIcon className="h-8 w-8" />
                                                    <span className="text-[10px]">No image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            <ImageIcon className="h-3 w-3" /> After Image
                                        </h4>
                                        <div className="relative aspect-4/3 rounded-lg border overflow-hidden bg-muted group">
                                            {project.caseStudy.afterImageUrl ? (
                                                <Image src={project.caseStudy.afterImageUrl} alt="After" fill className="object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full gap-1 opacity-20">
                                                    <ImageIcon className="h-8 w-8" />
                                                    <span className="text-[10px]">No image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-md bg-linear-to-br from-card to-muted/10">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                Details & Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <DetailRow label="Slug" value={project.slug} isCode />
                            <DetailRow label="ID" value={project._id} isCode />
                            <div className="relative">
                                <DetailRow label="Status" value={project.status} isBadge />
                                {project.status === 'Draft' && project.hasPublished && (
                                    <span className="absolute right-0 bottom-0 text-[10px] text-amber-600 font-medium animate-pulse">
                                        Has unpublished changes
                                    </span>
                                )}
                            </div>
                            <DetailRow label="Category" value={project.displayCategory} />
                            <DetailRow label="Created" value={new Date(project._createdAt).toLocaleDateString()} />
                            <DetailRow label="Updated" value={new Date(project._updatedAt).toLocaleDateString()} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Project Configuration Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        <SectionStatus label="Main Description" isActive={!!project.displayDescription} />
                        <SectionStatus label="Main Image" isActive={!!project.mainImageUrl} />
                        <SectionStatus label="SEO Tags" isActive={!!(project.seo?.metaTitle && project.seo?.metaDescription)} />
                        <SectionStatus
                            label="Case Study"
                            isActive={!!project.caseStudy}
                            variant="optional"
                            activeLabel="Case Study Enabled"
                            inactiveLabel="Basic Project"
                        />
                        {project.caseStudy && (
                            <>
                                <SectionStatus
                                    label="Results & Stats"
                                    isActive={!!(project.caseStudy.results && project.caseStudy.results.length > 0)}
                                    count={project.caseStudy.results?.length}
                                    variant="optional"
                                />
                                <SectionStatus
                                    label="Testimonial"
                                    isActive={!!project.caseStudy.testimonial}
                                    variant="optional"
                                />
                            </>
                        )}
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
                <code className="text-xs bg-muted/80 px-2 py-1 rounded font-mono text-primary/80 border transition-colors group-hover:bg-muted group-hover:border-primary/20 truncate max-w-[120px]">{value || "None"}</code>
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
