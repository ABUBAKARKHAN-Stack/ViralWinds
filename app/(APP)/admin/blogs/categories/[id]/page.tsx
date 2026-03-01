import { CategoryForm } from "@/components/admin/categories/CategoryForm"
import { getCategoryById } from "@/app/actions/category"
import { notFound } from "next/navigation"

interface EditCategoryPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params
    const category = await getCategoryById(id)

    if (!category) {
        notFound()
    }

    return (
        <div className="container mx-auto pb-10 max-w-5xl py-10">
            <CategoryForm initialData={category} />
        </div>
    )
}
