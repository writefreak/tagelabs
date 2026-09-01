"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import TeamCard from "./ui/team-card";

interface TeamMember {
  name: string;
  title: string;
  image: string;
}

export default function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPage, setScrollPage] = useState(0);

  useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      const { data, error } = await supabase
        .from("team")
        .select("name, position, image_url")
        .order("created_at", { ascending: true });

      if (!error && data) {
        const formattedMembers: TeamMember[] = data.map((item) => ({
          name: item.name,
          title: item.position,
          image: item.image_url || "/placeholder-avatar.png",
        }));
        setTeam(formattedMembers);
      }
      setLoading(false);
    }

    fetchTeam();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || team.length === 0) return;

    const onScroll = () => {
      const cardWidth = el.scrollWidth / team.length;
      const index = Math.round(el.scrollLeft / cardWidth);
      setScrollPage(index);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [team.length]);

  function scrollTo(index: number) {
    const el = scrollRef.current;
    if (!el || team.length === 0) return;

    const clamped = Math.max(0, Math.min(team.length - 1, index));
    const cardWidth = el.scrollWidth / team.length;
    el.scrollTo({ left: cardWidth * clamped, behavior: "smooth" });
    setScrollPage(clamped);
  }

  return (
    <section
      id="team"
      className="border-b border-b-gray-100 px-6 py-16 md:px-14 md:py-28"
    >
      <div className="mx-auto">
        <div className="flex flex-col items-center justify-center gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="font-display text-2xl font-semibold leading-tight text-primary sm:text-5xl"
          >
            Meet The Founders
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="max-w-lg text-center font-body text-xs leading-relaxed text-neutral-600 md:text-base"
          >
            We're a result-driven team focused on fostering growth, and client
            partnership through excellent project delivery
          </motion.p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : team.length === 0 ? null : (
          <>
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pt-10 scroll-smooth mx-auto md:max-w-5xl md:justify-center md:gap-8 md:overflow-visible"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                  className="w-full shrink-0 snap-start sm:w-auto sm:shrink md:w-[24vw]"
                >
                  <TeamCard member={member} />
                </motion.div>
              ))}
            </div>

            {team.length > 1 && (
              <div className="flex items-center justify-center gap-4 pt-5 md:hidden">
                <button
                  onClick={() => scrollTo(scrollPage - 1)}
                  disabled={scrollPage === 0}
                  aria-label="Previous member"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-offwhite transition-opacity disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>

                <button
                  onClick={() => scrollTo(scrollPage + 1)}
                  disabled={scrollPage === team.length - 1}
                  aria-label="Next member"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-offwhite transition-opacity disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
