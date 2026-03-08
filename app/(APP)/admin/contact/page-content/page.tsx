import { getContactPageContentForAdmin, getContactPageDraft } from "@/app/actions/contactPageContent";
import { ContactPageContentForm } from "@/components/admin/form/ContactPageContentForm";

// Force this page to be dynamic (no caching)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ContactPageContentPage() {
    // Try to load draft first, fallback to published content
    const draft = await getContactPageDraft();
    const published = await getContactPageContentForAdmin();


    const pageContent = draft || published;
    const hasDraft = !!draft;
    const draftUpdatedAt = draft?._updatedAt || null;

    return (
        <div className="container mx-auto pb-10">
            <ContactPageContentForm
                initialData={pageContent as any}
                hasDraft={hasDraft}
                draftUpdatedAt={draftUpdatedAt}
            />
        </div>
    );
}
