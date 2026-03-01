import { BlogForm } from "@/components/admin/blogs/BlogForm"
import { getBlogFormOptions, getPostById } from "@/app/actions/blog"
import { getBlogDraft } from "@/app/actions/blogDraftActions"
import { notFound } from "next/navigation"

interface EditBlogPageProps {
    params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
    const { id } = await params
    const [post, { services, categories, locations }] = await Promise.all([
        getPostById(id),
        getBlogFormOptions()
    ])

    if (!post) {
        notFound()
    }

    const hasDraft = post._id.startsWith('drafts.')
    const draftUpdatedAt = post._updatedAt || null
    return (
        <div className="container mx-auto pb-10 max-w-5xl text-foreground">
            <BlogForm
                initialData={post}
                services={services}
                categories={categories}
                locations={locations}
                blogId={id.replace(/^(drafts\.)+/, '')}
                hasDraft={hasDraft}
                draftUpdatedAt={draftUpdatedAt}
            />
        </div>
    )
}
