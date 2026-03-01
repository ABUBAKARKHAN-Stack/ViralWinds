import { getLinkableContent } from "@/app/actions/menus"
import { MenuForm } from "@/components/admin/menus/MenuForm"

export default async function NewMenuPage() {
    const linkableContent = await getLinkableContent()

    return (
        <div className="container mx-auto py-6">
            <MenuForm linkableContent={linkableContent} />
        </div>
    )
}
