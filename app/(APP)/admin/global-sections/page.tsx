import { getGlobalSectionsForAdmin, getGlobalSectionsDraft } from "@/app/actions/globalSections";
import { getServiceOptions } from "@/app/actions/landingPageContent";
import { GlobalSectionsManageForm } from "@/components/admin/form/GlobalSectionsManageForm";

//* No Caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GlobalSectionsPage() {
    // Try to load draft first, fallback to published content
    const draft = await getGlobalSectionsDraft();
    const published = await getGlobalSectionsForAdmin();
    const services = await getServiceOptions();

    const globalContent = draft || published;
    const hasDraft = !!draft;
    const draftUpdatedAt = draft?._updatedAt || null;

    console.log('Global Sections Page loaded - Has draft:', hasDraft)

    return (
        <div className="container mx-auto pb-10">
            <GlobalSectionsManageForm
                initialData={globalContent as any}
                draftUpdatedAt={draftUpdatedAt}
                services={services}
            />
        </div>
    );
}
