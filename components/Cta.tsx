"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import PixelStar from "./PixelStar";
import Reveal from "./Reveal";
import SplitWords from "./SplitWords";
import Magnetic from "./Magnetic";
import PixelConfetti, { type Burst } from "./PixelConfetti";
import dynamic from "next/dynamic";

const MoonScene = dynamic(() => import("./MoonScene"), {
  ssr: false,
  loading: () => null,
});

export default function Cta() {
  const [burst, setBurst] = useState<Burst | null>(null);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    };
  }, []);

  const fire = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    setBurst((b) => ({
      key: (b?.key ?? 0) + 1,
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
    }));
    burstTimerRef.current = setTimeout(() => setBurst(null), 1100);
  };

  return (
    <section id="buy" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-nyahu-blue/40 blur-[130px]"
      />
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <MoonScene />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines" />
      <span
        aria-hidden="true"
        dir="rtl"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-hebrew text-[clamp(4rem,20vw,13rem)] font-bold whitespace-nowrap text-nyahu-gold/[0.06] select-none"
      >
        עַד הַיָּרֵחַ
      </span>

      <Reveal className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="font-pixel text-[10px] text-nyahu-gold uppercase">
            The Empire Needs You
          </span>
          <PixelStar className="h-3 w-3 text-nyahu-gold" />
        </div>
        <h2 className="font-heading mt-4 text-4xl font-bold sm:text-6xl">
          <SplitWords text="Join the Takeover" wordClassName="text-gradient-gold-v" />
        </h2>
        <p className="mt-5 max-w-xl text-lg text-slate-400">
          0% tax, LP burned, contract renounced. Grab your bag before the empire does.
        </p>

        <div className="mt-10 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row">
          <Magnetic className="block w-full sm:inline-block sm:w-auto">
            <a
              href="https://raydium.io"
              target="_blank"
              rel="noopener noreferrer"
              onClick={fire}
              className="flex w-full items-center justify-center gap-3 border-2 border-black/50 bg-nyahu-gold px-7 py-4 font-pixel text-[11px] text-abyss shadow-[6px_6px_0_0_#001a5c] transition-all duration-150 hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-[2px_2px_0_0_#001a5c] sm:w-auto"
            >
              Buy on Raydium
              <ArrowUpRight size={18} />
            </a>
          </Magnetic>
          <Magnetic className="block w-full sm:inline-block sm:w-auto">
            <a
              href="https://t.me/nyahucoin"
              target="_blank"
              rel="noopener noreferrer"
              onClick={fire}
              className="glass flex w-full items-center justify-center gap-3 px-7 py-4 font-pixel text-[11px] text-white shadow-[6px_6px_0_0_rgba(212,175,55,0.75)] transition-all duration-150 hover:translate-x-1.5 hover:translate-y-1.5 hover:border-nyahu-gold/50 hover:shadow-[2px_2px_0_0_rgba(212,175,55,0.75)] sm:w-auto"
            >
              Join Telegram
              <Send size={16} className="text-nyahu-gold" />
            </a>
          </Magnetic>
        </div>
      </Reveal>

      <PixelConfetti burst={burst} />
    </section>
  );
}
