"use client";

import { useCallback, useEffect, useState } from "react";
import TeamForm from "@/components/admin/team-form";
import TeamList from "@/components/admin/team-list";
import { supabase } from "@/app/lib/supabase";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string | null;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team")
      .select("id, name, position, image_url")
      .order("created_at", { ascending: true });

    if (!error && data) setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <div className="min-h-screen  px-4 py-8 sm:px-6 sm:py-12 lg:px-14">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-xl md:text-2xl font-semibold text-navy sm:text-3xl">
          Team
        </h1>
        <p className="mt-1 font-body text-xs md:text-sm text-navy/50">
          Manage who shows up in the Meet the Founders section.
        </p>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TeamForm onCreated={fetchMembers} />
          </div>
          <div className="lg:col-span-7">
            <TeamList
              members={members}
              loading={loading}
              onDeleted={fetchMembers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
