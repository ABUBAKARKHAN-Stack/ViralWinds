import { ProjectForm } from "@/components/admin/portfolio/ProjectForm"

export default async function NewProjectPage() {
    const projectId = crypto.randomUUID()

    return (
        <div className="container mx-auto pb-10 max-w-5xl">
            <ProjectForm
                projectId={projectId}
            />
        </div>
    )
}
