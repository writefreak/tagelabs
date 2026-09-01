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
    <div className="min-h-screen py-8 sm:px-6 ">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-navy sm:text-3xl">
          Manage The Team
        </h1>
        <p className="mt-1 font-body text-xs md:text-sm text-navy/50">
          Create, delete or update who shows up in the Meet the Founders section
        </p>

        <div className="pt-8 gap-8">
          <div className="">
            <TeamForm onCreated={fetchMembers} />
          </div>
          <div className="pt-6">
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
