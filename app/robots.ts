import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Демо закрыто от индексации. TODO(запуск): на verhom.by заменить на allow: "/"
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
