import { getSiteSettings } from "@/app/actions/siteSettings";
import { getMenus } from "@/app/actions/menus";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";

export default async function SiteSettingsPage() {
    const siteSettings = await getSiteSettings();
    const menus = await getMenus();

    // Transform sanity data into form values if needed
    const initialData = siteSettings ? {
        siteName: siteSettings.siteName || "",
        tagline: siteSettings.tagline || "",
        logo: siteSettings.logo,
        favicon: siteSettings.favicon,
        seo: {
            metaTitle: siteSettings.seo?.metaTitle || "",
            metaDescription: siteSettings.seo?.metaDescription || "",
            focusKeyword: siteSettings.seo?.focusKeyword || "",
            relatedKeywords: siteSettings.seo?.relatedKeywords || [],
            schemas: siteSettings.seo?.schemas || [""]
        },
        socialLinks: siteSettings.socialLinks || [],
        contactInfo: siteSettings.contactInfo || [],
        footerCTA: siteSettings.footerCTA || {
            eyebrow: "",
            headingPrefix: "",
            headingHighlight: "",
            buttonText: "",
            buttonUrl: "/contact"
        },
        footerText: siteSettings.footerText || "",
        copyright: siteSettings.copyright || "",
        headerMenu: siteSettings.headerMenu || { _type: 'reference', _ref: "" },
        footerMenu: siteSettings.footerMenu || { _type: 'reference', _ref: "" },
    } : undefined;

    return (
        <div className="container mx-auto pb-10">
            <SiteSettingsForm initialData={initialData as any} menus={menus} />
        </div>
    );
}
