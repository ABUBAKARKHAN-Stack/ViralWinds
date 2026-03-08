"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { client } from '@/sanity/lib/client'
import { CheckCircle2, Circle } from 'lucide-react'
import { useEffect, useState } from 'react'

type HealthMetrics = {
    landing: boolean;
    about: boolean;
    servicesPage: boolean;
    portfolioPage: boolean;
    contactPage: boolean;

    headerMenu: boolean;
    footerMenu: boolean;
    siteSettings: boolean;

    services: boolean;
    projects: boolean;
}

export const CmsHealthcheck = () => {
    const [metrics, setMetrics] = useState<HealthMetrics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const queries = [
                    { key: "landing", query: `defined(*[_type == "landingPageContent"][0]._id)` },
                    { key: "about", query: `defined(*[_type == "aboutPageContent"][0]._id)` },
                    { key: "servicesPage", query: `defined(*[_type == "servicesPageContent"][0]._id)` },
                    { key: "portfolioPage", query: `defined(*[_type == "portfolioPageContent"][0]._id)` },
                    { key: "contactPage", query: `defined(*[_type == "contactPageContent"][0]._id)` },
                    { key: "headerMenu", query: `defined(*[_type == "menu" && location == "header"][0]._id)` },
                    { key: "footerMenu", query: `defined(*[_type == "menu" && location == "footer"][0]._id)` },
                    { key: "siteSettings", query: `defined(*[_type == "siteSettings"][0]._id)` },
                    { key: "services", query: `defined(*[_type == "service"][0]._id)` },
                    { key: "projects", query: `defined(*[_type == "project"][0]._id)` }
                ]

                // Execute all queries concurrently
                const rawResults = await Promise.all(
                    queries.map(q => client.fetch<boolean>(q.query))
                )

                // Reconstruct the HealthMetrics object
                const results: Partial<HealthMetrics> = {}
                queries.forEach((q, index) => {
                    results[q.key as keyof HealthMetrics] = rawResults[index]
                })

                setMetrics(results as HealthMetrics)

            } catch (error) {
                console.error("Error fetching CMS health:", error)
            } finally {
                setLoading(false)
            }
        }

        checkHealth()
    }, [])

    console.log(metrics);


    if (loading || !metrics) {
        return (
            <Card className="col-span-full border-primary/10 shadow-sm">
                <CardHeader className="pb-4 border-b bg-muted/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-64" />
                            <Skeleton className="h-4 w-80" />
                        </div>
                        <div className="w-full md:w-64 space-y-2">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-2.5 w-full rounded-full" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((col) => (
                            <div key={col} className="space-y-4">
                                <Skeleton className="h-5 w-32" />
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="flex items-start gap-3">
                                            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                                            <div className="space-y-2 w-full">
                                                <Skeleton className="h-4 w-2/3" />
                                                <Skeleton className="h-3 w-1/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    const categories = [
        {
            title: "Core Pages",
            items: [
                { label: "Landing Page", defined: metrics.landing },
                { label: "About Page", defined: metrics.about },
                { label: "Services Page", defined: metrics.servicesPage },
                { label: "Portfolio Page", defined: metrics.portfolioPage },
                { label: "Contact Page", defined: metrics.contactPage }
            ]
        },
        {
            title: "Content Collections",
            items: [
                { label: "Services Items", defined: metrics.services },
                { label: "Portfolio Projects", defined: metrics.projects },
            ]
        },
        {
            title: "Site Configuration",
            items: [
                { label: "Site Settings", defined: metrics.siteSettings },
                { label: "Header Menu", defined: metrics.headerMenu },
                { label: "Footer Menu", defined: metrics.footerMenu }
            ]
        }
    ]

    const allItems = categories.flatMap(c => c.items)
    const completed = allItems.filter(i => i.defined).length
    const total = allItems.length
    const percentage = Math.round((completed / total) * 100)

    return (
        <Card className="col-span-full border-primary/10 shadow-sm">
            <CardHeader className="pb-4 border-b bg-muted/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-semibold">CMS Configuration Health</CardTitle>
                        <CardDescription className="mt-1">
                            An overview of your required Sanity CMS configuration
                        </CardDescription>
                    </div>
                    <div className="w-full md:w-64 space-y-2">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className={percentage === 100 ? "text-emerald-500" : "text-primary"}>
                                {percentage}% Configured
                            </span>
                            <span className="text-muted-foreground">{completed}/{total}</span>
                        </div>
                        <Progress value={percentage} className="h-2.5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <div key={category.title} className="space-y-4">
                            <h3 className="font-semibold text-sm text-foreground/80 tracking-wide uppercase">
                                {category.title}
                            </h3>
                            <div className="space-y-3">
                                {category.items.map(item => (
                                    <div key={item.label} className="flex items-start gap-3">
                                        {item.defined ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                                        )}
                                        <div>
                                            <span className={`text-sm font-medium ${item.defined ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {item.label}
                                            </span>
                                            {!item.defined && (
                                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                                                    Action required
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
