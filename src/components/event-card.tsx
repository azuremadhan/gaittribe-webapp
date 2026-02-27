import Link from "next/link";
import Image from "next/image";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import type { EventType } from "@prisma/client";
import { formatDate, formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type EventCardProps = {
  event: {
    id: string;
    title: string;
    description: string;
    type: EventType;
    date: Date;
    location: string;
    price: number;
    capacity: number;
    _count: { registrations: number };
  };
};

const imageByType: Record<EventType, string> = {
  FITNESS: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
  TRIP: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
};

function getStatus(event: EventCardProps["event"]) {
  if (event.date.getTime() < Date.now()) return "CLOSED" as const;
  if (event._count.registrations >= event.capacity) return "FULL" as const;
  return "OPEN" as const;
}

function getBadgeVariant(status: ReturnType<typeof getStatus>) {
  if (status === "OPEN") return "open" as const;
  if (status === "FULL") return "full" as const;
  return "closed" as const;
}

export function EventCard({ event }: EventCardProps) {
  const status = getStatus(event);
  const taken = event._count.registrations;
  const fill = Math.min((taken / event.capacity) * 100, 100);

  return (
    <article className="card group overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageByType[event.type]}
          alt={`${event.type} event`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge variant="open">{event.type}</Badge>
        </div>
        <div className="absolute right-3 top-3">
          <Badge variant={getBadgeVariant(status)}>{status}</Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 text-xl font-extrabold tracking-tight text-ink">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{event.description}</p>

        <div className="mt-4 space-y-2 text-sm text-text-secondary">
          <p className="inline-flex items-center gap-2"><MapPin size={15} /> {event.location}</p>
          <p className="inline-flex items-center gap-2"><Calendar size={15} /> {formatDate(event.date)}</p>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-muted">
            <span className="inline-flex items-center gap-1"><Users size={13} /> {taken}/{event.capacity}</span>
            <span>{Math.max(event.capacity - taken, 0)} spots left</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className="h-2 animate-pulse-bar rounded-full bg-accent-primary transition-all duration-500 group-hover:bg-accent-glow"
              style={{ width: `${fill}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-primary px-3 py-1 text-xs font-bold text-white">
            <DollarSign size={13} />
            {formatINR(event.price * 100)}
          </span>
          <Link href={`/events/${event.id}`}>
            <Button variant="accent" size="sm">Register Now</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
