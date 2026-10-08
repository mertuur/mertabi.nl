import type { APIRoute } from "astro";
import { site } from "../data/site";

// Sitemap voor Google: alle pagina's uit het menu.
export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = site.nav
    .map(
      (item) => `  <url>
    <loc>${new URL(item.href, site.url).href}</loc>
    <lastmod>${today}</lastmod>
    <priority>${item.href === "/" ? "1.0" : "0.8"}</priority>
  </url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
