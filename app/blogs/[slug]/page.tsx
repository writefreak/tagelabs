import type { Metadata } from "next";
import { createClient } from "@/app/lib/supabase/server";
import BlogPostClient from "@/components/blog/blog-post-client";

type Props = {
  params: { slug: string };
};

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      url: `https://tagelabs.vercel.app/blogs/${post.slug}`,
      images: post.cover_image_url
        ? [
            {
              url: post.cover_image_url,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  return <BlogPostClient post={post} slug={params.slug} />;
}
