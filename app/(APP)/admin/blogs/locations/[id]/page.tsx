import { LocationForm } from "@/components/admin/locations/LocationForm"
import { getLocationById } from "@/app/actions/location"
import { notFound } from "next/navigation"

interface EditLocationPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditLocationPage({ params }: EditLocationPageProps) {
    const { id } = await params
    const location = await getLocationById(id)

    if (!location) {
        notFound()
    }

    return (
        <div className="container mx-auto pb-10 max-w-5xl py-10">
            <LocationForm initialData={location} />
        </div>
    )
}
