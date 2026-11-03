// URL pública do site, usada em robots.txt e sitemap.xml.
// Prioriza NEXT_PUBLIC_SITE_URL e cai para NEXTAUTH_URL como alternativa.
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
).replace(/\/+$/, "")