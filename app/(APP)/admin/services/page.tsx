import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ServicesClient } from "@/components/admin/services/ServicesClient"
import { Card } from "@/components/ui/card"
import { sanityFetch } from "@/sanity/lib/live"

// Define the type for the service data we're fetching
interface Service {
    _id: string
    title: string
    slug: string
    heroImageUrl?: string
    _updatedAt: string
    status: 'Draft' | 'Published'
    hasPublished?: boolean
}

import { getDashboardServices } from "@/app/actions/service"

export default async function ServicesPage() {
    const services = await getDashboardServices()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                    <p className="text-muted-foreground">
                        Manage your services and their content.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/services/add">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Total Services</span>
                    <span className="text-2xl font-bold">{services.length}</span>
                </Card>
                {/* Add more stats if needed */}
            </div>

            <ServicesClient services={services} />
        </div>
    )
}
