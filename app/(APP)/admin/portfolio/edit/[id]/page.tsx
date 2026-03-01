import { ProjectForm } from "@/components/admin/portfolio/ProjectForm"
import { getProjectById } from "@/app/actions/project"
import { notFound } from "next/navigation"

interface EditProjectPageProps {
    params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const { id } = await params
    const project = await getProjectById(id)

    if (!project) {
        notFound()
    }

    return (
        <div className="container mx-auto pb-10 max-w-5xl">
            <ProjectForm
                initialData={project}
                projectId={id}
                isEdit={true}
            />
        </div>
    )
}
