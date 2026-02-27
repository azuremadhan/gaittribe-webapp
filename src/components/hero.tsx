"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=2200&q=80",
  "https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=2200&q=80",
  "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=2200&q=80",
];

export function Hero({ hostHref }: { hostHref: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-block pt-6 sm:pt-8">
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
        <div className="relative h-[80vh] min-h-[520px] max-h-[860px]">
          {slides.map((slide, index) => (
            <div
              key={slide}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: activeIndex === index ? 1 : 0,
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(11,18,32,0.9)), url(${slide})`,
              }}
            />
          ))}

          <div className="section-shell relative z-10 flex h-full items-center">
            <div className="max-w-[700px] reveal-up">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">GAITTRIB COMMUNITY</p>
              <h1 className="mt-5 text-5xl font-extrabold uppercase leading-[1.1] tracking-wide text-text-primary sm:text-6xl lg:text-[64px]">
                Every Sport, Every Level, Every Weekend
              </h1>
              <p className="mt-4 max-w-xl text-base text-text-secondary sm:text-lg">
                Fitness community in Chennai📍
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#events">
                  <Button size="lg">Explore Events</Button>
                </Link>
                <Link href={hostHref}>
                  <Button size="lg" variant="outline">Host Event</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
