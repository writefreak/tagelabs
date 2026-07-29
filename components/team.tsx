"use client";

import { motion } from "framer-motion";
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
    name: "Meshack Douglas",
    title: "Frontend Developer & Growth Lead",
    image: "/meshack.jpg",
  },
  {
    name: "Asonye Samuel",
    title: "Brand Development & Client Partnership",
    image: "/meshack.jpg",
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
    const cardWidth = el.scrollWidth / team.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    setScrollPage(index);
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
            Meet Our Team
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
          className="flex mx-auto gap-4 pt-10 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:max-w-5xl"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
              className="w-[60vw] shrink-0 snap-start sm:w-auto sm:shrink"
            >
              <TeamCard member={member} />
            </motion.div>
          ))}
        </div>

        {team.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-5 md:hidden">
            {team.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to member ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === scrollPage
                    ? "w-5 h-1.5 bg-navy"
                    : "w-1.5 h-1.5 bg-navy/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
