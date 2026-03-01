import { ServiceForm } from "@/components/admin/services/ServiceForm"
import { getDashboardPosts } from "@/app/actions/blog"
import { getDashboardServices } from "@/app/actions/service"

export default async function AddServicePage() {
    const serviceId = crypto.randomUUID()
    const blogs = await getDashboardPosts()
    const services = await getDashboardServices()

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Add Service</h1>
                <p className="text-muted-foreground">
                    Create a new service.
                </p>
            </div>
            <ServiceForm
                serviceId={serviceId}
                availableBlogs={blogs}
                availableServices={services}
            />
        </div>
    )
}
