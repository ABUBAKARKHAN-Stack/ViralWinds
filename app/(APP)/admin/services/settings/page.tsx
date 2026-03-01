import { getServiceCta } from "@/app/actions/serviceCta";
import { ServiceCtaForm } from "@/components/admin/form/ServiceCtaForm";

export default async function ServiceSettingsPage() {
    const serviceCta = await getServiceCta();

    const initialData = serviceCta ? {
        ctaBadgeText: serviceCta.ctaBadgeText || {},
        ctaTitle: serviceCta.ctaTitle || {},
        ctaDescription: serviceCta.ctaDescription || {},
        ctaButtonText: serviceCta.ctaButtonText || {},
        ctaButtonUrl: serviceCta.ctaButtonUrl || {},
    } : undefined;

    return (
        <div className="container mx-auto pb-10">
            <ServiceCtaForm initialData={initialData as any} />
        </div>
    );
}
