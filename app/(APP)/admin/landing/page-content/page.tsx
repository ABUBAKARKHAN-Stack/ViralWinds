import { getLandingPageContentForAdmin, getLandingPageDraft, getServiceOptions, getProjectOptions, getCaseStudyOptions, getBlogPostOptions } from "@/app/actions/landingPageContent";
import { getGlobalSectionsForAdmin, getGlobalSectionsDraft } from "@/app/actions/globalSections";
import { LandingPageContentForm } from "@/components/admin/form/LandingPageContentForm";
import { getFormOptions } from "@/app/actions/portfolioPageContent";

// Force this page to be dynamic (no caching)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LandingPageContentPage() {
    // Try to load draft first, fallback to published content
    const [draft, published, globalDraft, globalPublished, services, projects, caseStudies, posts, forms] = await Promise.all([
        getLandingPageDraft(),
        getLandingPageContentForAdmin(),
        getGlobalSectionsDraft(),
        getGlobalSectionsForAdmin(),
        getServiceOptions(),
        getProjectOptions(),
        getCaseStudyOptions(),
        getBlogPostOptions(),
        getFormOptions()
    ]);

    const pageContent = draft || published;
    const globalContent = globalDraft || globalPublished;

    const hasDraft = !!draft || !!globalDraft;
    // Use the latest updatedAt if both exist
    const draftUpdatedAt = [draft?._updatedAt, globalDraft?._updatedAt]
        .filter(Boolean)
        .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0] || null;

    console.log('Page loaded - Has draft:', hasDraft, 'Draft updated:', draftUpdatedAt)

    const initialData = pageContent ? {
        ...pageContent,
        ...globalContent,
    } : undefined;

    return (
        <div className="container mx-auto pb-10">
            <LandingPageContentForm
                initialData={initialData as any}
                hasDraft={hasDraft}
                draftUpdatedAt={draftUpdatedAt}
                services={services}
                projects={projects}
                caseStudies={caseStudies}
                posts={posts}
                forms={forms}
            />
        </div>
    );
}
