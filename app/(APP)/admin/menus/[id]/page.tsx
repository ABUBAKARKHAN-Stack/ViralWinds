import { getLinkableContent, getMenuById } from "@/app/actions/menus"
import { MenuForm } from "@/components/admin/menus/MenuForm"
import { notFound } from "next/navigation"

interface EditMenuPageProps {
    params: Promise<{ id: string }>
}

export default async function EditMenuPage({ params }: EditMenuPageProps) {
    const { id } = await params
    const [menu, linkableContent] = await Promise.all([
        getMenuById(id),
        getLinkableContent()
    ])

    if (!menu) {
        notFound()
    }

    return (
        <div className="container mx-auto py-6">
            <MenuForm initialData={menu} linkableContent={linkableContent} />
        </div>
    )
}
