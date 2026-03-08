import { client } from "@/sanity/lib/client"
import { ArrowLeft, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { LinkProcessor } from "@/components/ui/LinkProcessor"
import { cn } from "@/lib/utils"
import { adminClient } from "@/sanity/lib/admin-client"

async function getService(id: string) {
    const baseId = id.replace(/^(drafts\.)+/, '');
    const query = `*[_type == "service" && (_id == $baseId || _id == "drafts." + $baseId)] {
        ...,
        "heroImageUrl": heroImage.asset->url
    }`
    const results = await adminClient.fetch(query, { baseId }, { perspective: "raw", useCdn: false })

    const draft = results.find((s: any) => s._id.startsWith('drafts.'));
    const published = results.find((s: any) => !s._id.startsWith('drafts.'));

    if (!draft && !published) return null;

    const latest = draft || published;

    // Safely extract title and slug strings (mirroring getDashboardServices logic)
    const titleValue = latest.title;
    const displayTitle = typeof titleValue === 'string'
        ? titleValue
        : (titleValue?.en || titleValue?.ar || (titleValue && typeof titleValue === 'object' ? Object.values(titleValue)[0] : null)) || "Untitled Service";

    const displaySlug = typeof latest.slug === 'string' ? latest.slug : latest.slug?.current || "";

    return {
        ...latest,
        _id: baseId,
        displayTitle,
        displaySlug,
        status: draft ? 'Draft' : 'Published',
        hasPublished: !!published
    }
}

export default async function ServiceViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const service = await getService(id)

    if (!service) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <Button variant="ghost" size="sm" asChild className="shrink-0 p-0 sm:p-2 sm:h-9 sm:px-4">
                        <Link href="/admin/services">
                            <ArrowLeft className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl sm:text-3xl font-bold truncate flex-1">{service.displayTitle}</h1>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none h-9">
                        <Link href={`/services/${service.displaySlug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                        </Link>
                    </Button>
                    <Button size="sm" asChild className="flex-1 sm:flex-none h-9">
                        <Link href={`/admin/services/edit/${service._id}`}>
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
                            Service Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative w-full h-64 rounded-xl overflow-hidden bg-muted border shadow-inner group">
                            {service.heroImageUrl ? (
                                <Image
                                    src={service.heroImageUrl}
                                    alt={service.heroImageAlt || service.displayTitle}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                    <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                                        <Eye className="h-6 w-6 opacity-20" />
                                    </div>
                                    <span className="text-sm font-medium">No hero image uploaded</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Subtitle</h3>
                            <p className={cn(
                                "text-lg font-medium leading-relaxed",
                                !service.subtitle && "text-muted-foreground/50 italic font-normal"
                            )}>
                                {service.subtitle || "No subtitle provided"}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Description</h3>
                            <div className={cn(
                                "text-muted-foreground leading-relaxed whitespace-pre-wrap",
                                !service.description && "text-muted-foreground/30 italic"
                            )}>
                                {service.description ? (
                                    <LinkProcessor text={service.description} />
                                ) : (
                                    "No description provided for this service."
                                )}
                            </div>
                        </div>
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
                        <DetailRow label="Slug" value={service.displaySlug} isCode />
                        <DetailRow label="ID" value={service._id} isCode />
                        <div className="relative ">
                            <DetailRow label="Status" value={service.status} isBadge />
                            {service.status === 'Draft' && service.hasPublished && (
                                <span className="absolute right-0 bottom-0 text-[9px] text-amber-600 font-medium animate-pulse">
                                    Has unpublished changes
                                </span>
                            )}
                        </div>
                        <DetailRow label="Created" value={new Date(service._createdAt).toLocaleDateString()} />
                        <DetailRow label="Updated" value={new Date(service._updatedAt).toLocaleDateString()} />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Content Sections Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">

                        <SectionStatus
                            label="Intro"
                            isActive={!!(service.introTitle && service.introTagLine && service.introContent)}
                        />
                        <SectionStatus
                            label="Role"
                            isActive={!!(service.roleTitle && service.roleContent?.length > 0)}
                            count={service.roleContent?.length}
                        />
                        <SectionStatus
                            label="How We Help"
                            isActive={!!(service.howWeHelpSection?.title && service.howWeHelpPoints?.length > 0)}
                            count={service.howWeHelpPoints?.length}
                        />
                        <SectionStatus
                            label="Overview"
                            isActive={!!(service.overviewSection?.title && service.items?.length > 0)}
                            count={service.items?.length}
                        />
                        <SectionStatus
                            label="Process"
                            isActive={!!(service.processSection?.title && service.process?.length > 0)}
                            count={service.process?.length}
                        />
                        <SectionStatus
                            label="Areas"
                            isActive={!!(service.areasSection?.title && service.areas?.length > 0)}
                            count={service.areas?.length}
                        />
                        <SectionStatus
                            label="Industries"
                            isActive={!!(service.industriesSection?.title && service.industries?.length > 0)}
                            count={service.industries?.length}
                        />
                        <SectionStatus
                            label="Benefits"
                            isActive={!!(service.benifitsSection?.title && service.benefits?.length > 0)}
                            count={service.benefits?.length}
                        />
                        <SectionStatus
                            label="Why Us"
                            isActive={!!(service.whyChooseUsSection?.title && service.whyChooseUsPoints?.length > 0)}
                            count={service.whyChooseUsPoints?.length}
                        />
                        <SectionStatus
                            label="Case Studies"
                            isActive={!!(service.caseStudiesSection?.title && service.caseStudies?.length > 0)}
                            count={service.caseStudies?.length}
                        />
                        <SectionStatus
                            label="FAQs"
                            isActive={!!(service.faqsSection?.title && service.faqs?.length > 0)}
                            count={service.faqs?.length}
                        />

                        <SectionStatus
                            label="Others"
                            isActive={!!(service.otherServicesSection?.title && service.otherServices?.length > 0)}
                            count={service.otherServices?.length}
                        />
                        <SectionStatus
                            label="SEO"
                            isActive={!!(service.seo?.metaTitle && service.seo?.metaDescription)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function DetailRow({ label, value, isCode = false, isBadge = false }: { label: string, value?: string, isCode?: boolean, isBadge?: boolean }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-muted last:border-0 hover:bg-muted/10 px-2 rounded-lg transition-colors">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            {isBadge ? (
                <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                    value === 'Published' ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                )}>
                    {value}
                </span>
            ) : isCode ? (
                <code className="text-xs bg-muted/80 px-2 py-1 rounded font-mono text-primary/80 border">{value || "None"}</code>
            ) : (
                <span className="text-sm font-semibold">{value || "N/A"}</span>
            )}
        </div>
    )
}

function SectionStatus({ label, isActive, count }: { label: string, isActive: boolean, count?: number }) {
    return (
        <div className={cn(
            "flex flex-col gap-2 p-4 border rounded-xl transition-all duration-300 relative overflow-hidden group shadow-sm",
            isActive
                ? "bg-green-50/30 border-green-100 dark:bg-green-500/5 dark:border-green-500/10"
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
                    isActive ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-destructive'
                )} />
                <span className={cn(
                    "text-xs font-semibold",
                    isActive ? "text-green-700 dark:text-green-400" : "text-destructive"
                )}>
                    {isActive ? 'Configured' : 'Missing Content'}
                </span>
            </div>

            {/* Hover effect background */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                isActive ? "bg-green-500/5" : "bg-destructive/5"
            )} />
        </div>
    )
}
