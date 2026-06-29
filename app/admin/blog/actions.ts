"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type BlogSection = {
  heading: string;
  body: string;
};

type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url?: string | null;
  sections: BlogSection[];
  published: boolean;
};

export async function createPost(input: BlogPostInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      cover_image_url: input.cover_image_url || null,
      sections: input.sections,
      published: input.published,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(`/admin/blog/${data.id}`);
}

export async function updatePost(id: string, input: BlogPostInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      cover_image_url: input.cover_image_url || null,
      sections: input.sections,
      published: input.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${input.slug}`);
}

export async function deletePost(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}
