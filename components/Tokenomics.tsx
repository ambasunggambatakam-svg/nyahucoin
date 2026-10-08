"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Coins, Flame, Lock, Percent } from "lucide-react";
import PixelStar from "./PixelStar";
import Reveal from "./Reveal";

type Token = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint: string;
};

const TOKENOMICS: Token[] = [
  {
    icon: Coins,
    label: "Total Supply",
    value: (
      <>
        <CountUp value={1_000_000_000} />
        <span className="ml-2 text-nyahu-gold">NYAHU</span>
      </>
    ),
    hint: "Fixed forever",
  },
  {
    icon: Percent,
    label: "Taxes",
    value: "0% Buy / 0% Sell",
    hint: "Keep every coin you earn",
  },
  {
    icon: Flame,
    label: "Liquidity",
    value: "100% Burned",
    hint: "Nobody pulls the rug",
  },
  {
    icon: Lock,
    label: "Contract",
    value: "Immutable & Renounced",
    hint: "No mint, no edits",
  },
];

function CountUp({ value, duration = 2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.floor(v).toLocaleString("en-US")),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

function TokenCard({ token, index }: { token: Token; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <Reveal delay={index * 0.1}>
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          className="glass spotlight group relative h-full overflow-hidden border-2 border-nyahu-gold/20 p-6 shadow-[6px_6px_0_0_rgba(0,56,184,0.35)] transition-all duration-300 hover:-translate-y-2 hover:border-nyahu-gold/60 hover:shadow-[8px_8px_0_0_rgba(212,175,55,0.65)] before:pointer-events-none before:absolute before:inset-0 before:border before:border-dashed before:border-white/10 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-60 after:pointer-events-none after:absolute after:-inset-y-3 after:left-0 after:w-20 after:-translate-x-[240%] after:skew-x-[-20deg] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:transition-transform after:duration-700 after:content-[''] group-hover:after:translate-x-[560%]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              backgroundImage:
                "radial-gradient(280px circle at var(--mx) var(--my), rgba(212,175,55,0.22), transparent 70%)",
            }}
          />
          <div className="relative flex h-full flex-col">
            <div className="flex h-14 w-14 items-center justify-center border-2 border-nyahu-gold-light/70 bg-nyahu-blue/30 text-nyahu-gold shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:bg-nyahu-gold group-hover:text-abyss">
              <token.icon size={26} />
            </div>
            <p className="mt-6 font-pixel text-[9px] tracking-wider text-slate-500 uppercase">
              {token.label}
            </p>
            <p className="font-heading mt-3 text-2xl font-bold text-white">{token.value}</p>
            <p className="mt-auto pt-4 text-sm text-slate-500">{token.hint}</p>
          </div>
          <div className="pointer-events-none absolute -top-4 -right-4 h-16 w-16 bg-nyahu-gold/10 blur-xl transition-opacity duration-300 group-hover:opacity-80" />
        </div>
    </Reveal>
  );
}

export default function Tokenomics() {
  return (
    <section
      id="tokenomics"
      className="relative mx-auto max-w-6xl overflow-hidden px-4 py-24 sm:px-6 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-nyahu-gold/10 blur-[130px] -z-10"
      />
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="font-pixel text-[10px] text-nyahu-gold uppercase">The Numbers</span>
          <PixelStar className="h-3 w-3 text-nyahu-gold" />
            <span className="font-hebrew text-base font-medium text-nyahu-gold/70" dir="rtl">
              הַמִּסְפָּרִים
            </span>
        </div>
        <h2 className="font-heading mt-4 text-3xl font-bold text-white sm:text-5xl">
          Sacred Tokenomics
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TOKENOMICS.map((token, index) => (
          <TokenCard key={token.label} token={token} index={index} />
        ))}
      </div>
    </section>
  );
}
