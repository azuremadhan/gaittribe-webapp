import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";
import type { EventCategory, EventType } from "@prisma/client";
import { formatDate, formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";

type EventCardProps = {
  event: {
    id: string;
    title: string;
    description: string;
    type: EventType;
    category: EventCategory;
    date: Date;
    location: string;
    price: number;
    capacity: number;
    _count: { registrations: number };
  };
};

const imageByCategory: Record<EventCategory, string> = {
  RUNNING: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
  HYROX: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  FOOTBALL: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
  BADMINTON: "https://images.unsplash.com/photo-1626245027680-80a0880cf248?auto=format&fit=crop&w=800&q=80",
  CRICKET: "https://images.unsplash.com/photo-1531415074968-b2a8f5f9b6f8?auto=format&fit=crop&w=800&q=80",
  PICKLEBALL: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
  RETREAT: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80",
  TOURNAMENT: "https://images.unsplash.com/photo-1461896836934-4d463d1d3a78?auto=format&fit=crop&w=800&q=80",
  OTHER: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
};

const categoryColors: Record<EventCategory, string> = {
  RUNNING: "bg-rose-500/20 text-rose-400",
  HYROX: "bg-orange-500/20 text-orange-400",
  FOOTBALL: "bg-green-500/20 text-green-400",
  BADMINTON: "bg-amber-500/20 text-amber-400",
  CRICKET: "bg-red-500/20 text-red-400",
  PICKLEBALL: "bg-emerald-500/20 text-emerald-400",
  RETREAT: "bg-violet-500/20 text-violet-400",
  TOURNAMENT: "bg-cyan-500/20 text-cyan-400",
  OTHER: "bg-zinc-500/20 text-zinc-400",
};

function getStatus(event: EventCardProps["event"]) {
  if (event.date.getTime() < Date.now()) return "CLOSED" as const;
  if (event._count.registrations >= event.capacity) return "FULL" as const;
  return "OPEN" as const;
}

export function EventCard({ event }: EventCardProps) {
  const status = getStatus(event);
  const taken = event._count.registrations;
  const fill = Math.min((taken / event.capacity) * 100, 100);

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className="card overflow-hidden transition-all duration-300 hover:border-[#e8c547]/30">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imageByCategory[event.category] || imageByCategory.OTHER}
            alt={event.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute left-3 top-3">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${categoryColors[event.category]}`}>
              {event.category}
            </span>
          </div>
          
          {status !== "OPEN" && (
            <div className="absolute right-3 top-3">
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {status}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate">{event.title}</h3>
          
          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {event.location}
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-lg font-bold text-[#e8c547]">₹{event.price * 100}</p>
              <p className="flex items-center gap-1 text-xs text-zinc-500">
                <Users size={11} />
                {taken}/{event.capacity} registered
              </p>
            </div>
            <Button size="sm" variant="accent">Register</Button>
          </div>
        </div>
      </article>
    </Link>
  );
}
