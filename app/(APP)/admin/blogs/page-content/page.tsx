import { getBlogPageContentForAdmin, getBlogPageDraft, getBlogFormOptions, getFormOptions } from "@/app/actions/blogPageContent";
import { BlogPageContentForm } from "@/components/admin/form/BlogPageContentForm";

export default async function BlogPageContentPage() {
    const [draft, published, posts, forms] = await Promise.all([
        getBlogPageDraft(),
        getBlogPageContentForAdmin(),
        getBlogFormOptions(),
        getFormOptions()
    ]);



    const pageContent = draft || published;
    const hasDraft = !!draft;
    const draftUpdatedAt = draft?._updatedAt || null;

    const initialData = pageContent ? {
        hero: pageContent.hero || {},
        blogList: {
            posts: pageContent.blogList?.posts || [],
        },
        cta: pageContent.cta || {},
        seo: pageContent.seo || {}
    } : undefined;

    return (
        <div className="container mx-auto pb-10">
            <BlogPageContentForm
                initialData={initialData as any}
                hasDraft={hasDraft}
                draftUpdatedAt={draftUpdatedAt}
                posts={posts}
                forms={forms}
            />
        </div>
    );
}
