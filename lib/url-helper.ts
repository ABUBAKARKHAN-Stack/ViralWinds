/**
 * Get a localized URL with base URL and language prefix
 * @param path - The path without leading slash (e.g., "contact", "services/web-design")
 * @param lang - The language code (e.g., "en", "ur", "es", "ar")
 * @returns Full URL with base URL and language prefix (e.g., "http://localhost:3000/en/contact")
 */
export function getLocalizedUrl(path: string, lang: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    // Remove leading slash from path if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}/${lang}/${cleanPath}`;
}

/**
 * Get base URL from environment
 */
export function getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_BASE_URL || '';
}
