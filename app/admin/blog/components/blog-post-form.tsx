"use client";

import { useState } from "react";

type BlogSection = {
  heading: string;
  body: string;
};

type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  sections: BlogSection[];
  published: boolean;
  isEditorsPick: boolean; // ← add
};

type InitialPost = {
  title?: string;
  slug?: string;
  excerpt?: string;
  sections?: BlogSection[];
  published?: boolean;
  isEditorsPick?: boolean; // ← add
} | null;

type BlogPostFormProps = {
  initialPost?: InitialPost;
  onSubmit: (input: BlogPostInput) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export default function BlogPostForm({
  initialPost,
  onSubmit,
  onDelete,
}: BlogPostFormProps) {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [sections, setSections] = useState<BlogSection[]>(
    initialPost?.sections?.length
      ? initialPost.sections
      : [{ heading: "", body: "" }],
  );
  const [published, setPublished] = useState(initialPost?.published || false);
  const [isEditorsPick, setIsEditorsPick] = useState(
    initialPost?.isEditorsPick || false,
  ); // ← add
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function updateSection(
    index: number,
    field: keyof BlogSection,
    value: string,
  ) {
    const next = [...sections];
    next[index] = { ...next[index], [field]: value };
    setSections(next);
  }

  function addSection() {
    setSections([...sections, { heading: "", body: "" }]);
  }

  function removeSection(index: number) {
    setSections(sections.filter((_, i) => i !== index));
  }

  function moveSection(index: number, direction: number) {
    const next = [...sections];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!initialPost) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      );
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        title,
        slug,
        excerpt,
        sections: sections.filter((s) => s.body.trim().length > 0),
        published,
        isEditorsPick, // ← add
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    const confirmed = window.confirm(
      "Delete this post permanently? This can't be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);
    setError("");
    try {
      await onDelete();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting.",
      );
      setDeleting(false);
    }
  }

  const wordCount = sections
    .map((s) => s.body.trim().split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm text-gray-600"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Excerpt (used for SEO description and previews)
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          maxLength={160}
          className="w-full border rounded-md px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">{excerpt.length}/160</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Sections</label>
          <span className="text-xs text-gray-500">{wordCount} words total</span>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border rounded-md p-3 space-y-2 bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Section {index + 1}
                </span>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                    className="text-gray-500 disabled:opacity-30"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, 1)}
                    disabled={index === sections.length - 1}
                    className="text-gray-500 disabled:opacity-30"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    disabled={sections.length === 1}
                    className="text-red-500 disabled:opacity-30"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <input
                type="text"
                placeholder="Subheading (optional, leave blank for plain paragraph)"
                value={section.heading}
                onChange={(e) =>
                  updateSection(index, "heading", e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm font-medium"
              />

              <textarea
                placeholder="Paragraph text"
                value={section.body}
                onChange={(e) => updateSection(index, "body", e.target.value)}
                rows={4}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSection}
          className="mt-3 text-sm font-medium text-blue-600"
        >
          + Add section
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published" className="text-sm">
          Published
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={saving || deleting}
          className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save post"}
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="text-sm text-red-600 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete post"}
          </button>
        )}
      </div>
    </form>
  );
}
