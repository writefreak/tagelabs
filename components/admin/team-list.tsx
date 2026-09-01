"use client";

import { useState } from "react";
import { Trash2, Loader2, User } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string | null;
}

interface TeamListProps {
  members: TeamMember[];
  loading: boolean;
  onDeleted: () => void;
}

export default function TeamList({
  members,
  loading,
  onDeleted,
}: TeamListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(member: TeamMember) {
    const confirmed = window.confirm(`Remove ${member.name} from the team?`);
    if (!confirmed) return;

    setDeletingId(member.id);

    try {
      if (member.image_url) {
        const path = member.image_url.split("/team/").pop();
        if (path) {
          await supabase.storage.from("team").remove([path]);
        }
      }

      const { error } = await supabase
        .from("team")
        .delete()
        .eq("id", member.id);
      if (error) throw error;

      onDeleted();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-navy/10 bg-white py-16">
        <Loader2 size={20} className="animate-spin text-navy/40" />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-white py-16 text-center">
        <p className="font-body text-sm text-navy/50">
          No team members yet. Add your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-2">
      {members.map((member) => (
        <article key={member.id} className="group relative w-full">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-900">
            {/* Delete Button */}
            <button
              onClick={() => handleDelete(member)}
              disabled={deletingId === member.id}
              aria-label={`Remove ${member.name}`}
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-red-600 hover:text-white disabled:opacity-50"
            >
              {deletingId === member.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>

            {/* Image / Fallback */}
            {member.image_url ? (
              <img
                src={member.image_url}
                alt={member.name}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-offwhite text-navy/30">
                <User size={48} />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

            {/* Member Details */}
            <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
              <div className="flex flex-col gap-0.5 rounded-xl bg-offwhite p-3">
                <h3 className="truncate font-display text-sm font-semibold leading-snug text-ink md:text-base">
                  {member.name}
                </h3>
                <span className="truncate font-body text-xs text-neutral-600 md:text-sm">
                  {member.position}
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
