import type { Metadata } from "next";
import { createClient } from "@/app/lib/supabase/server";
import BlogPostClient from "@/components/blog/blog-post-client";
import EditorsPicks from "@/components/blog/editors-pick-client";

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

  return (
    <div className="bg-white min-h-screen py-12 md:py-20 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
        {/* Main Blog Article Area */}
        <div className="lg:col-span-8">
          <BlogPostClient post={post} slug={params.slug} />
        </div>

        {/* Sidebar: Editor's Picks */}
        <div className="lg:col-span-4 pt-4 lg:pt-16">
          <EditorsPicks currentSlug={params.slug} />
        </div>
      </div>
    </div>
  );
}
