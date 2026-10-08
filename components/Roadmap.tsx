"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import PixelStar from "./PixelStar";
import Reveal from "./Reveal";
import SplitWords from "./SplitWords";

const PHASES = [
  {
    phase: "Phase 1",
    he: "הַתְּחִלָּה",
    title: "The Genesis",
    items: ["Launch", "Website", "DexScreener Update", "1000 Holders"],
  },
  {
    phase: "Phase 2",
    he: "הַכִּבּוּשׁ",
    title: "The Takeover",
    items: ["CEX Listings", "Global Marketing", "Tel Aviv Billboards"],
  },
  {
    phase: "Phase 3",
    he: "אִימְפֵּרִיָּה",
    title: "The Empire",
    items: ["Market Cap Dominance", "Utility Integration", "100,000+ Holders"],
  },
];

export default function Roadmap() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.75", "end 0.55"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section
      id="roadmap"
      className="relative mx-auto max-w-6xl overflow-hidden px-4 py-24 sm:px-6 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-nyahu-blue/30 blur-[130px] -z-10"
      />
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="font-pixel text-[10px] text-nyahu-gold uppercase">The Roadmap</span>
          <PixelStar className="h-3 w-3 text-nyahu-gold" />
          <span className="font-hebrew text-base font-medium text-nyahu-gold/70" dir="rtl">
            מַסְלּוּל
          </span>
        </div>
        <h2 className="font-heading mt-4 text-3xl font-bold text-white sm:text-5xl">
          <SplitWords text="The Journey to the Promise Land" stagger={0.06} />
        </h2>
      </Reveal>

      <div ref={listRef} className="relative mt-16">
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-[26px] w-0.5 bg-white/10 lg:left-1/2" />
        <motion.div
          aria-hidden="true"
          style={{ scaleY: lineProgress, transformOrigin: "top" }}
          className="absolute top-0 bottom-0 left-[26px] w-0.5 bg-[repeating-linear-gradient(180deg,#d4af37_0_8px,#f5d76e_8px_16px)] shadow-[0_0_8px_rgba(212,175,55,0.7)] lg:left-1/2"
        />

        {PHASES.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <Reveal
              key={item.title}
              delay={index * 0.1}
              className={`relative mb-14 pl-16 last:mb-0 lg:w-1/2 lg:pl-0 ${
                isLeft ? "lg:mr-auto lg:pr-16" : "lg:ml-auto lg:pl-16"
              }`}
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.15 }}
                className={`absolute top-1 flex h-11 w-11 items-center justify-center border-2 border-nyahu-gold bg-abyss font-heading text-sm font-bold text-nyahu-gold shadow-[4px_4px_0_0_rgba(212,175,55,0.4)] ${
                  isLeft ? "left-[4px] lg:right-[-22px] lg:left-auto" : "left-[4px] lg:left-[-22px]"
                }`}
              >
                {index + 1}
                <span
                  aria-hidden="true"
                  className="animate-pixel-ping pointer-events-none absolute inset-0 border-2 border-nyahu-gold/60"
                />
              </motion.div>

              <div className="glass border-2 border-nyahu-gold/20 p-6 shadow-[6px_6px_0_0_rgba(0,56,184,0.35)] transition-all duration-300 hover:-translate-y-2 hover:border-nyahu-gold/60 hover:shadow-[8px_8px_0_0_rgba(212,175,55,0.6)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-pixel text-[9px] tracking-wider text-nyahu-gold uppercase">
                    {item.phase}
                  </span>
                  <span className="font-hebrew text-sm font-medium text-nyahu-gold/70" dir="rtl">
                    {item.he}
                  </span>
                </div>
                <h3 className="font-heading mt-2 text-2xl font-bold text-white">{item.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {item.items.map((task) => (
                    <li
                      key={task}
                      className={`flex items-center gap-2.5 text-sm text-slate-400 ${
                        isLeft ? "lg:flex-row-reverse lg:text-right" : ""
                      }`}
                    >
                      <Check size={15} className="shrink-0 text-nyahu-gold" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
