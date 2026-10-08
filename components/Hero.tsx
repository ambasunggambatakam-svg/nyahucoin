"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, Copy, TrendingUp } from "lucide-react";
import SplitWords from "./SplitWords";
import { useBootPad } from "./Shell";
import Magnetic from "./Magnetic";
import PixelConfetti, { type Burst } from "./PixelConfetti";
import dynamic from "next/dynamic";

const VoxelField = dynamic(() => import("./VoxelField"), {
  ssr: false,
  loading: () => null,
});

const CONTRACT_ADDRESS = "7NYahuPr0misedC0in3000YearsAg0pump";

type Sprite = {
  id: string;
  kind: "coin" | "letter";
  letter?: string;
  size: number;
  style: React.CSSProperties;
  depth: "back" | "front";
  duration: number;
  delay: number;
  faded?: boolean;
  blue?: boolean;
  hideOnMobile?: boolean;
};

const SPRITES: Sprite[] = [
  { id: "c1", kind: "coin", size: 64, style: { top: "14%", left: "6%" }, depth: "back", duration: 6.5, delay: 0 },
  { id: "c2", kind: "coin", size: 44, style: { top: "24%", right: "8%" }, depth: "front", duration: 7, delay: 1.1 },
  { id: "c3", kind: "coin", size: 96, style: { bottom: "16%", left: "3%" }, depth: "back", duration: 8, delay: 0.5, faded: true, hideOnMobile: true },
  { id: "c4", kind: "coin", size: 56, style: { bottom: "24%", right: "10%" }, depth: "front", duration: 6, delay: 0.8, blue: true },
  { id: "h1", kind: "letter", letter: "ש", size: 60, style: { top: "12%", right: "26%" }, depth: "back", duration: 7.5, delay: 1.5, hideOnMobile: true },
  { id: "h2", kind: "letter", letter: "ל", size: 54, style: { top: "56%", left: "11%" }, depth: "front", duration: 6.5, delay: 0.3, hideOnMobile: true },
  { id: "h3", kind: "letter", letter: "ו", size: 48, style: { bottom: "36%", right: "22%" }, depth: "back", duration: 5.5, delay: 1.9, hideOnMobile: true },
  { id: "h4", kind: "letter", letter: "ם", size: 52, style: { bottom: "14%", left: "30%" }, depth: "front", duration: 7, delay: 2.3, hideOnMobile: true },
];

const STARS = Array.from({ length: 30 }, (_, i) => ({
  left: (i * 37 + 11) % 98,
  top: ((i * 61 + 7) % 90) + 3,
  size: 1 + (i % 3),
  dur: 2.4 + (i % 5) * 0.7,
  delay: (i % 10) * 0.45,
}));

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [burst, setBurst] = useState<Burst | null>(null);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pad = useBootPad();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const exitY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 20 });
  const sy = useSpring(my, { stiffness: 45, damping: 20 });

  const orbX = useTransform(sx, (v) => v * -70);
  const orbY = useTransform(sy, (v) => v * -50);
  const backX = useTransform(sx, (v) => v * -40);
  const backY = useTransform(sy, (v) => v * -30);
  const frontX = useTransform(sx, (v) => v * -95);
  const frontY = useTransform(sy, (v) => v * -70);
  const contentX = useTransform(sx, (v) => v * 22);
  const contentY = useTransform(sy, (v) => v * 16);
  const contentYFinal = useTransform<number, number>(
    [contentY, exitY],
    ([a, b]) => a + b,
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    } catch {
      return;
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handlePointer = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onPointerMove={handlePointer}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-32 pb-24"
    >
      <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <VoxelField />
      </div>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STARS.map((star, i) => (
          <span
            key={i}
            className={`pixel-star absolute ${i % 3 === 0 ? "bg-nyahu-gold-light" : "bg-white/80"}`}
            style={
              {
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                "--star-dur": `${star.dur}s`,
                "--star-delay": `${star.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <motion.div
        style={{ x: orbX, y: orbY }}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 bg-nyahu-blue/40 blur-[130px]"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
        className="pointer-events-none absolute top-[18%] right-[12%] h-40 w-40 bg-nyahu-gold/20 blur-[80px]"
        aria-hidden="true"
      />

      <motion.div
        style={{ x: backX, y: backY }}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {SPRITES.filter((s) => s.depth === "back").map((sprite) => (
          <FloatingSprite key={sprite.id} sprite={sprite} />
        ))}
      </motion.div>

      <motion.div
        style={{ x: frontX, y: frontY }}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {SPRITES.filter((s) => s.depth === "front").map((sprite) => (
          <FloatingSprite key={sprite.id} sprite={sprite} />
        ))}
      </motion.div>

      <motion.div
        style={{ x: contentX, y: contentYFinal, opacity: exitOpacity }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <h1
          className="font-heading glitch-in text-4xl leading-[1.15] font-bold drop-shadow-[0_4px_40px_rgba(212,175,55,0.25)] sm:text-6xl lg:text-7xl xl:text-8xl"
          style={{ animationDelay: `${1.9 + pad}s` }}
        >
          <SplitWords
            text="The Coin Promised 3000 Years Ago."
            wordClassName="text-gradient-gold-v"
            delay={0.15 + pad}
            stagger={0.07}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 + pad, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-2xl text-base text-slate-400 sm:text-lg"
        >
          Unearthing the Future of Finance. Born in Tel Aviv, Empowering Generations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 + pad, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row"
        >
          <Magnetic className="block w-full sm:inline-block sm:w-auto">
            <a
              href="https://raydium.io"
              target="_blank"
              rel="noopener noreferrer"
              onClick={fire}
              className="flex w-full items-center justify-center gap-3 border-2 border-black/50 bg-nyahu-gold px-7 py-4 font-pixel text-[11px] text-abyss shadow-[6px_6px_0_0_#001a5c] transition-all duration-150 hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-[2px_2px_0_0_#001a5c] active:translate-x-1.5 active:translate-y-1.5 sm:w-auto"
            >
              Buy on Raydium
              <ArrowUpRight size={18} />
            </a>
          </Magnetic>

          <Magnetic className="block w-full sm:inline-block sm:w-auto">
            <a
              href="https://dexscreener.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={fire}
              className="glass flex w-full items-center justify-center gap-3 px-7 py-4 font-pixel text-[11px] text-white shadow-[6px_6px_0_0_rgba(212,175,55,0.75)] transition-all duration-150 hover:translate-x-1.5 hover:translate-y-1.5 hover:border-nyahu-gold/50 hover:shadow-[2px_2px_0_0_rgba(212,175,55,0.75)] sm:w-auto"
            >
              DexScreener Chart
              <TrendingUp size={18} className="text-nyahu-gold" />
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 + pad, ease: [0.22, 1, 0.36, 1] }}
          className="glass mt-10 flex w-full max-w-xl items-center gap-3 px-4 py-3 shadow-[5px_5px_0_0_rgba(0,56,184,0.45)] sm:px-5"
        >
          <span className="hidden font-pixel text-[9px] text-slate-500 sm:block">CA</span>
          <code className="min-w-0 flex-1 truncate font-mono text-sm text-slate-300">
            {CONTRACT_ADDRESS}
          </code>
          <Magnetic>
            <button
              type="button"
              onClick={(e) => {
                fire(e);
                void handleCopy();
              }}
              aria-label="Copy contract address"
              className="relative flex shrink-0 items-center gap-2 border-2 border-black/50 bg-nyahu-blue px-3 py-2 font-pixel text-[9px] text-white transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-nyahu-blue-bright"
            >
              {copied ? <Check size={14} className="text-nyahu-gold-light" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
              {copied && (
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 border-2 border-black/60 bg-nyahu-gold px-2 py-1 font-pixel text-[9px] whitespace-nowrap text-abyss shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]">
                  Copied!
                </span>
              )}
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.a
        href="#vision"
        aria-label="Scroll to vision"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 + pad, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="glass flex h-11 w-11 items-center justify-center text-slate-400 transition-colors hover:border-nyahu-gold/60 hover:text-nyahu-gold"
        >
          <ChevronDown size={20} />
        </motion.span>
      </motion.a>

      <PixelConfetti burst={burst} />
    </section>
  );
}

function FloatingSprite({ sprite }: { sprite: Sprite }) {
  const { size, style, duration, delay, kind, letter, faded, blue, hideOnMobile } = sprite;

  const face =
    kind === "coin"
      ? blue
        ? "border-2 border-nyahu-blue-bright bg-nyahu-blue font-pixel text-white shadow-[4px_4px_0_0_#001a5c]"
        : "border-2 border-nyahu-gold-light bg-nyahu-gold font-pixel text-abyss shadow-[4px_4px_0_0_#001a5c]"
      : "border-2 border-nyahu-gold/70 bg-abyss-soft/90 font-hebrew font-bold text-nyahu-gold shadow-[4px_4px_0_0_rgba(212,175,55,0.35)]";

  return (
    <div
      className={`absolute ${hideOnMobile ? "hidden sm:block" : ""} ${faded ? "opacity-55" : ""}`}
      style={style}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1, y: [0, -18, 0], rotate: [0, 6, -6, 0] }}
        transition={{
          opacity: { duration: 0.8, delay },
          scale: { duration: 0.8, delay },
          y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: duration * 1.4, delay, repeat: Infinity, ease: "easeInOut" },
        }}
        className={`flex items-center justify-center ${face}`}
        style={{
          width: size,
          height: size,
          fontSize: kind === "coin" ? Math.round(size * 0.42) : Math.round(size * 0.52),
        }}
      >
        {kind === "coin" ? "N" : letter}
      </motion.div>
    </div>
  );
}
