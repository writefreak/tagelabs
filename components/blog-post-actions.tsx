"use client";
import { useState } from "react";
import Link from "next/link";
import { Share2, LayoutGrid, Check } from "lucide-react";

type Props = {
  title: string;
  slug: string;
};

export default function BlogPostActions({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `https://tagelabs.vercel.app/blogs/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet — no-op
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-end gap-3 py-6 border-t border-gray-200">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-navy/70 hover:text-navy px-4 py-2 rounded-full border border-navy/10 hover:border-navy/25 transition-colors duration-200"
      >
        {copied ? <Check size={14} /> : <Share2 size={14} />}
        {copied ? "Link copied" : "Share"}
      </button>

      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-navy/70 hover:text-navy px-4 py-2 rounded-full border border-navy/10 hover:border-navy/25 transition-colors duration-200"
      >
        <LayoutGrid size={14} />
        See others
      </Link>
    </div>
  );
}
