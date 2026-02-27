"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=2200&q=80",
    title: "Book. Compete. Belong.",
    subtitle: "Premium weekend events for Chennai athletes.",
  },
  {
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2200&q=80",
    title: "Structured Fitness Community",
    subtitle: "From registration to leaderboard — one serious platform.",
  },
  {
    image: "https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=2200&q=80",
    title: "Every Sport. Every Level.",
    subtitle: "Build consistency with curated events every weekend.",
  },
];

export function Hero({ hostHref }: { hostHref: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-block pb-10 pt-6 sm:pt-8">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="relative h-[78vh] min-h-[520px] max-h-[820px]">
          {slides.map((slide, index) => (
            <div
              key={slide.image}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                opacity: activeIndex === index ? 1 : 0,
                backgroundImage: `linear-gradient(to right, rgba(6,12,25,0.88) 22%, rgba(6,12,25,0.55) 58%, rgba(6,12,25,0.86) 100%), url(${slide.image})`,
              }}
            />
          ))}

          <div className="section-shell relative z-10 flex h-full items-center">
            <div className="max-w-3xl reveal-up">
              <span className="chip">GAITTRIB · CHENNAI FITNESS COMMUNITY</span>
              <h1 className="mt-5 text-4xl font-black uppercase leading-[1.05] tracking-wide text-white sm:text-6xl lg:text-7xl">
                {slides[activeIndex].title}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
                {slides[activeIndex].subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#events">
                  <Button size="lg">Explore Events</Button>
                </Link>
                <Link href={hostHref}>
                  <Button size="lg" variant="outline">Host Event</Button>
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                  <p className="text-xl font-extrabold text-white">500+</p>
                  <p className="text-xs text-text-secondary">Athletes</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                  <p className="text-xl font-extrabold text-white">50+</p>
                  <p className="text-xs text-text-secondary">Events hosted</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                  <p className="text-xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-text-secondary">Rank transparency</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${activeIndex === idx ? "w-8 bg-accent-glow" : "w-2.5 bg-white/35"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
