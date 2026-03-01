export function t(
  field: Record<string, string>,
  lang: string,
  fallback = 'en'
) {
  return field?.[lang] || field?.[fallback] || '';
}
