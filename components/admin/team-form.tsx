"use client";

import { useRef, useState } from "react";
import { Loader2, UserPlus, ImagePlus, X } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

interface TeamFormProps {
  onCreated: () => void;
}

export default function TeamForm({ onCreated }: TeamFormProps) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !position.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      let image_url: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("team")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("team")
          .getPublicUrl(path);

        image_url = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("team").insert({
        name: name.trim(),
        position: position.trim(),
        image_url,
      });

      if (insertError) throw insertError;

      setName("");
      setPosition("");
      clearFile();
      onCreated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-6 lg:sticky lg:top-6"
    >
      <h2 className="font-display text-sm font-semibold text-navy md:text-lg sm:text-xl">
        Add Team Member
      </h2>
      <div className="md:hidden">
        <label className="font-body text-xs font-medium text-navy/80 md:text-sm">
          Photo
        </label>

        {preview ? (
          <div className="mt-1.5 flex flex-col items-center justify-center gap-3 rounded-xl border border-navy/10 bg-offwhite p-4">
            <img
              src={preview}
              alt="Preview"
              className="h-28 w-28 rounded-2xl object-cover shadow-sm"
            />
            <button
              type="button"
              onClick={clearFile}
              className="flex items-center gap-1.5 font-body text-xs text-navy/60 hover:text-navy"
            >
              <X size={14} />
              Remove photo
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-1.5 flex h-[184px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-navy/20 bg-offwhite p-4 font-body text-sm text-navy/60 transition-colors hover:border-blue hover:text-blue"
          >
            <ImagePlus size={24} />
            <span>Upload photo</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Responsive layout container: stacked on mobile, 2-cols on desktop */}
      <div className="mt-5 grid grid-cols-1 items-start gap-5 md:grid-cols-2">
        {/* Left Side: Inputs & Action */}
        <div className="space-y-4">
          <div>
            <label className="font-body text-xs font-medium text-navy/80 md:text-sm">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Endwell Heritage"
              required
              className="mt-1.5 w-full rounded-xl border border-navy/15 bg-offwhite px-4 py-2.5 font-body text-sm text-navy outline-none transition-colors focus:border-blue"
            />
          </div>

          <div>
            <label className="font-body text-xs font-medium text-navy/80 md:text-sm">
              Position
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Founder & Lead Developer"
              required
              className="mt-1.5 w-full rounded-xl border border-navy/15 bg-offwhite px-4 py-2.5 font-body text-sm text-navy outline-none transition-colors focus:border-blue"
            />
          </div>

          {error && <p className="font-body text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 font-body text-sm font-medium text-offwhite transition-opacity disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <UserPlus size={16} />
            )}
            {submitting ? "Adding..." : "Add Member"}
          </button>
        </div>

        {/* Right Side: Photo Upload Zone */}
        <div className="hidden md:block">
          <label className="font-body text-xs font-medium text-navy/80 md:text-sm">
            Photo
          </label>

          {preview ? (
            <div className="mt-1.5 flex flex-col items-center justify-center gap-3 rounded-xl border border-navy/10 bg-offwhite p-4">
              <img
                src={preview}
                alt="Preview"
                className="h-28 w-28 rounded-2xl object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={clearFile}
                className="flex items-center gap-1.5 font-body text-xs text-navy/60 hover:text-navy"
              >
                <X size={14} />
                Remove photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 flex h-[184px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-navy/20 bg-offwhite p-4 font-body text-sm text-navy/60 transition-colors hover:border-blue hover:text-blue"
            >
              <ImagePlus size={24} />
              <span>Upload photo</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </form>
  );
}
