"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TeamCard from "./ui/team-card";

interface TeamMember {
  name: string;
  title: string;
  image: string;
}

const team: TeamMember[] = [
  {
    name: "Endwell Heritage",
    title: "Founder & Lead Developer",
    image: "/tage.png",
  },

  {
    name: "Asonye Samuel",
    title: "Co-Founder & Client Partnerships Lead",
    image: "/sammy.png",
  },
];

export default function TeamSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPage, setScrollPage] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / (team.length || 1);
      const index = Math.round(el.scrollLeft / cardWidth);
      setScrollPage(index);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(team.length - 1, index));
    const cardWidth = el.scrollWidth / team.length;
    el.scrollTo({ left: cardWidth * clamped, behavior: "smooth" });
    setScrollPage(clamped);
  }

  return (
    <section
      id="team"
      className="py-16 border-b border-b-gray-100 md:px-14 px-6 md:py-28"
    >
      <div className="mx-auto ">
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
            className="max-w-lg text-center font-body text-xs md:text-base leading-relaxed text-neutral-600"
          >
            We're a result-driven team focused on fostering growth, and client
            partnership through excellent project delivery
          </motion.p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 pt-10 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth mx-auto md:justify-center md:gap-8 md:overflow-visible md:max-w-5xl"
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
      </div>
    </section>
  );
}
