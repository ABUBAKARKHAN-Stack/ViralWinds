/**
 * Resolves a URL from a menu item object.
 * Handles custom URLs and references to various content types (services, pages, singletons).
 */
export const resolveUrl = (item: any) => {
    if (!item) return '#';

    // 1. Handle Custom URLs
    if (item.type === 'custom') {
        return item.slug || item.url || '#';
    }

    // 2. Handle References
    if (item.type === 'reference' && item.reference) {
        const ref = item.reference;
        const type = ref._type;
        const slug = ref.slug;

        // Map specific singleton types to their fixed routes
        switch (type) {
            case 'landingPageContent':
                return '/';
            case 'aboutPageContent':
                return '/about';
            case 'servicesPageContent':
                return '/services';
            case 'portfolioPageContent':
                return '/portfolio';

            case 'contactPageContent':
                return '/contact';
            case 'service':
                return slug ? `/services/${slug}` : '/services';
            case 'page':
                return slug ? `/${slug}` : '#';

            default:
                // Fallback for types that might use slugs
                return slug ? `/${slug}` : '#';
        }
    }

    // 3. Fallback for Header/Column types (often used in footers)
    return '#';
};
