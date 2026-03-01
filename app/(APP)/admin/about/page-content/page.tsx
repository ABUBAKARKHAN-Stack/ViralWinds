import { getAboutPageContentForAdmin, getAboutPageDraft } from "@/app/actions/aboutPageContent";
import { getServiceOptions } from "@/app/actions/landingPageContent";
import { getGlobalSectionsForAdmin, getGlobalSectionsDraft } from "@/app/actions/globalSections";
import { AboutPageContentForm } from "@/components/admin/form/AboutPageContentForm";

// Force this page to be dynamic (no caching)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AboutPageContentPage() {
    // Try to load draft first, fallback to published content
    const draft = await getAboutPageDraft();
    const published = await getAboutPageContentForAdmin();

    const globalDraft = await getGlobalSectionsDraft();
    const globalPublished = await getGlobalSectionsForAdmin();
    const services = await getServiceOptions();

    const pageContent = draft || published;
    const globalContent = globalDraft || globalPublished;

    const hasDraft = !!draft || !!globalDraft;
    // Use the latest updatedAt if both exist
    const draftUpdatedAt = [draft?._updatedAt, globalDraft?._updatedAt]
        .filter(Boolean)
        .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0] || null;

    const initialData = pageContent ? {
        ...pageContent,
        ...globalContent,
    } : undefined;

    return (
        <div className="container mx-auto pb-10">
            <AboutPageContentForm
                initialData={initialData as any}
                hasDraft={hasDraft}
                draftUpdatedAt={draftUpdatedAt}
                services={services}
            />
        </div>
    );
}
