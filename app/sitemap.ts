import { createClient } from "./lib/supabase/server";

type SitemapPost = {
  slug: string;
  updated_at: string;
};

export default async function sitemap() {
  const baseUrl = "https://tagelabs.vercel.app";

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("published", true)
    .returns<SitemapPost[]>();

  const blogUrls = (posts || []).map((post: SitemapPost) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.updated_at,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
