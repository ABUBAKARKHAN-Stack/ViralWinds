import { ServiceForm } from "@/components/admin/services/ServiceForm"
import { getDashboardServices } from "@/app/actions/service"

export default async function AddServicePage() {
    const serviceId = crypto.randomUUID()
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
                availableServices={services}
            />
        </div>
    )
}
