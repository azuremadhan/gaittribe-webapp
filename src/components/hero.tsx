"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=2200&q=80",
    title: "Every Sport. Every Weekend.",
    subtitle: "Chennai's most active fitness community",
  },
  {
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2200&q=80",
    title: "Train Together. Compete Forever.",
    subtitle: "Join 1,600+ athletes across 14+ formats",
  },
  {
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2200&q=80",
    title: "Push Your Limits.",
    subtitle: "HYROX, running & functional fitness events",
  },
  {
    image: "https://images.unsplash.com/photo-1626245027680-80a0880cf248?auto=format&fit=crop&w=2200&q=80",
    title: "Smash Your Goals.",
    subtitle: "Badminton, cricket & tournament sports",
  },
];

export function Hero({ hostHref, isAdmin }: { hostHref: string; isAdmin: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-block">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#12151c]">
        <div className="relative aspect-[2.4/1] min-h-[480px]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
              style={{
                opacity: activeIndex === index ? 1 : 0,
                transform: activeIndex === index ? "scale(1)" : "scale(1.05)",
                backgroundImage: `linear-gradient(to right, rgba(10,12,16,0.92) 0%, rgba(10,12,16,0.4) 50%, rgba(10,12,16,0.85) 100%), url(${slide.image})`,
              }}
            />
          ))}

          <div className="absolute inset-0 flex items-center">
            <div className="section-shell w-full">
              <div className="max-w-xl">
                <span className="chip mb-6 block w-fit">📍 Chennai</span>
                <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {slides[activeIndex].title}
                </h1>
                <p className="mt-5 text-lg text-zinc-400">
                  {slides[activeIndex].subtitle}
                </p>

                <div className="mt-8 flex gap-4">
                  <Link href="#events" className="btn-primary inline-flex items-center gap-2">
                    Get Started <ArrowRight size={16} />
                  </Link>
                  {isAdmin && (
                    <Link href={hostHref} className="btn-outline">
                      Host Event
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1 rounded-full transition-all duration-500 ${activeIndex === idx ? "w-8 bg-[#e8c547]" : "w-6 bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
