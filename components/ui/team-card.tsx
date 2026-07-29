import { cn } from "@/app/lib/utils";

interface TeamMember {
  name: string;
  title: string;
  image: string;
}

interface TeamCardProps {
  member: TeamMember;
  className?: string;
}

export default function TeamCard({ member, className }: TeamCardProps) {
  return (
    <article className={cn("group relative", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <img
          src={member.image}
          alt={member.name}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
          <div className="flex flex-col gap-1 rounded-xl bg-offwhite p-3">
            <h3 className="font-display text-sm font-semibold leading-snug text-ink md:text-base">
              {member.name}
            </h3>
            <span className="font-body text-xs md:text-sm text-neutral-600">
              {member.title}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
