"use client"
import React from "react";

const team = [
  {
    name: "Endwell Heritage",
    role: "Founder & Lead Developer",
   
    
    image: "/heritage.jpg",
  },
  {
    name: "Meshack Douglas",
    role: "Frontend Developer & Growth Lead",
  
    image: "/meshack.jpg",
  },
  {
    name: "Asonye Samuel",
    role: "Brand Development & Client Partnership",
    image: "/meshack.jpg",

   
    
  },
];

export default function TeamSection() {
  return (
    <section className="w-full  py-20 px-6 lg:px-12 xl:px-24 2xl:px-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mb-12 lg:mb-16">
          
          <h2 className="font-display text-2xl  lg:text-4xl font-semibold text-navy mb-4">
           Meet Our Team
          </h2>
          <p className="font-body text-xs lg:text-sm max-w-sm  text-navy/50 leading-relaxed">
            A small, deliverable-driven team out of Port Harcourt: engineering,
            growth, and client partnership under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
          {team.map((member, i) => (
            <div
              key={member.name}
              className={`opacity-0-init animate-fade-in delay-${
                (i + 1) * 100
              } group bg-white border border-navy/10 rounded-2xl overflow-hidden hover:border-[var(--blue)]/40 transition-colors duration-300`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-navy/5">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
               
              </div>

              <div className="p-6 lg:p-7">
                <h3 className="font-display text-lg lg:text-xl font-semibold text-navy mb-1">
                  {member.name}
                </h3>
                <p className="font-body text-sm text-[var(--blue)] font-medium mb-4">
                  {member.role}
                </p>
                
              
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}