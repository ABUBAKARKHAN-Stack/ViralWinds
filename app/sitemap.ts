import { BASE_URL } from "@/constants/app.constants";
import { getProjectSlugs } from "@/helpers/portfolio.helpers";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const portfolio = await getProjectSlugs();

  return [

    //* Home Page sitemap
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "daily",
    },

    //* About Page sitemap
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },

    //* Services Page sitemap
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "monthly",
    },

    //* Portfolio Page sitemap
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "yearly",
    },

    //* Contact Page sitemap
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: "yearly",
    },


    //* Dymainc Portfolio Pages
    ...portfolio.map((p) => ({
      url: `${BASE_URL}/portfolio/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
