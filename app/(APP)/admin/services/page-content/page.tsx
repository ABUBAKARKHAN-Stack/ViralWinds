import { getServicesPageContentForAdmin, getServicesPageDraft } from "@/app/actions/servicesPageContent";
import { ServicesPageContentForm } from "@/components/admin/form/ServicesPageContentForm";

export default async function ServicesPageContentPage() {
    const draft = await getServicesPageDraft();
    const published = await getServicesPageContentForAdmin();

    const pageContent = draft || published;
    const hasDraft = !!draft;
    const draftUpdatedAt = draft?._updatedAt || null;

    const initialData = pageContent ? {
        hero: pageContent.hero || {},
        intro: pageContent.intro || {},
        process: {
            sectionHeading: pageContent.process?.sectionHeading || {},
            steps: pageContent.process?.steps || [],
        },
        whyChooseUs: {
            sectionHeading: pageContent.whyChooseUs?.sectionHeading || {},
            guaranteePoints: pageContent.whyChooseUs?.guaranteePoints || [],
            benefits: pageContent.whyChooseUs?.benefits || [],
        },
        servicesList: {
            sectionHeading: pageContent.servicesList?.sectionHeading || {},
            services: pageContent.servicesList?.services?.map((service: any) =>
                typeof service === 'string' ? service : service?._ref
            ).filter(Boolean) || [],
        },
        seo: pageContent.seo || undefined,
    } : undefined;

    return (
        <div className="container mx-auto pb-10">
            <ServicesPageContentForm
                initialData={initialData as any}
                hasDraft={hasDraft}
                draftUpdatedAt={draftUpdatedAt}
            />
        </div>
    );
}
