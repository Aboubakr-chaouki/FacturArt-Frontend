export function getLogoUrl(logo: string | File | undefined | null, baseUrl: string): string | undefined {
    if (!logo) return undefined;
    if (logo instanceof File) return URL.createObjectURL(logo);
    if (typeof logo !== 'string') return undefined;

    const path = logo.slice(logo.indexOf('/uploads'));
    return path.startsWith('/uploads') ? `${baseUrl}${path}` : logo;
}