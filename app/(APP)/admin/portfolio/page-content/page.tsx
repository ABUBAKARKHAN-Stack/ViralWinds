import { getPortfolioPageContentForAdmin, getPortfolioPageDraft, getPortfolioFormOptions, getFormOptions } from "@/app/actions/portfolioPageContent";
import { PortfolioPageContentForm } from "@/components/admin/form/PortfolioPageContentForm";

export default async function PortfolioPageContentPage() {
    const [draft, published, projects, forms] = await Promise.all([
        getPortfolioPageDraft(),
        getPortfolioPageContentForAdmin(),
        getPortfolioFormOptions(),
        getFormOptions()
    ]);

    const pageContent = draft || published;
    const hasDraft = !!draft;
    const draftUpdatedAt = draft?._updatedAt || null;

    const initialData = pageContent ? {
        hero: pageContent.hero || {},
        portfolioList: {
            projects: pageContent.portfolioList?.projects || [],
        },
        cta: pageContent.cta || {},
        seo: pageContent.seo || {}
    } : undefined;

    return (
        <div className="container mx-auto pb-10">
            <PortfolioPageContentForm
                initialData={initialData as any}
                hasDraft={hasDraft}
                draftUpdatedAt={draftUpdatedAt}
                projects={projects}
                forms={forms}
            />
        </div>
    );
}
