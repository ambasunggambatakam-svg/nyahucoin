"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { play } from "@/lib/sfx";

const LINES = [
  "> NYAHU BIOS v3.000",
  "> CHECKING SHALOM......... OK",
  "> SACRED TOKENOMICS........ OK",
  "> MINTING 1,000,000,000.... OK",
  "> LAUNCHING nyahu.exe_",
];
const TOTAL = LINES.reduce((n, l) => n + l.length, 0);
const CHARS_MS = 13;
const EXIT_MS = 650;

export default function BootLoader({
  onExit,
  onDone,
}: {
  onExit: () => void;
  onDone: () => void;
}) {
  const [chars, setChars] = useState(0);
  const [slam, setSlam] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const leftRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const leave = useCallback(() => {
    if (leftRef.current) return;
    leftRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSlam(true);
    setLeaving(true);
    play("coin");
    onExit();
    timeoutRef.current = setTimeout(onDone, EXIT_MS + 60);
  }, [onDone, onExit]);

  useEffect(() => {
    let i = 0;
    const pending: ReturnType<typeof setTimeout>[] = [];
    intervalRef.current = setInterval(() => {
      i += 1;
      setChars(i);
      if (i >= TOTAL) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        pending.push(setTimeout(() => setSlam(true), 120));
        pending.push(setTimeout(() => leave(), 760));
      }
    }, CHARS_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      pending.forEach((t) => clearTimeout(t));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [leave]);

  let rem = chars;
  let typingIdx = -1;
  const rendered: Array<{ line: string; idx: number; isTyping: boolean }> = [];
  for (let i = 0; i < LINES.length; i++) {
    const line = LINES[i];
    const take = Math.min(rem, line.length);
    const shown = line.slice(0, take);
    if (typingIdx === -1 && take < line.length) typingIdx = i;
    rem -= take;
    rendered.push({ line: shown, idx: i, isTyping: typingIdx === i && take < line.length });
  }
  if (typingIdx === -1 && !slam) {
    typingIdx = LINES.length - 1;
    rendered[rendered.length - 1].isTyping = true;
  }

  const filled = Math.round((chars / TOTAL) * 16);
  const pct = Math.round((chars / TOTAL) * 100);

  return (
    <div
      onPointerDown={() => leave()}
      role="status"
      aria-label="Booting NyahuCoin"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-abyss px-6"
      style={{
        transform: leaving ? "translateY(-100%)" : "translateY(0)",
        transition: `transform ${EXIT_MS}ms cubic-bezier(0.7, 0, 0.3, 1)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
      <div className="crt-roll" aria-hidden="true" />
      <div className="crt-on" aria-hidden="true" />

      <div className="crt-flicker relative w-full max-w-md">
        <motion.div
          animate={{ opacity: leaving ? 0 : 1, y: leaving ? -24 : 0 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-md"
        >
        <div
          className={`glass-gold p-5 transition-opacity duration-300 ${slam ? "opacity-0" : "opacity-100"}`}
        >
          <div className="mb-4 flex items-center gap-2 border-b border-nyahu-gold/25 pb-3">
            <span className="h-2 w-2 bg-nyahu-blue-bright" />
            <span className="h-2 w-2 bg-nyahu-gold" />
            <span className="h-2 w-2 bg-nyahu-gold/40" />
            <span className="ml-2 font-pixel text-[7px] text-slate-500">nyahu_boot.sh</span>
          </div>

          <div aria-live="polite">
            {rendered.map((item) => (
              <div
                key={item.idx}
                className="min-h-[1.35em] font-pixel text-[9px] leading-relaxed whitespace-pre text-nyahu-gold/90"
              >
                {item.line || "\u00A0"}
                {item.isTyping && (
                  <span className="animate-blink ml-0.5 inline-block h-2.5 w-1.5 translate-y-0.5 bg-nyahu-gold" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-1" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 flex-1 ${i < filled ? "bg-nyahu-gold" : "bg-white/10"}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between">
            <span className="font-pixel text-[7px] text-slate-500">LOADING</span>
            <span className="font-pixel text-[7px] text-nyahu-gold/70">{pct}%</span>
          </div>
        </div>

        {slam && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          >
            <span className="font-heading text-5xl font-bold text-gradient-gold-v sm:text-6xl">
              NYAHUCOIN
            </span>
            <span className="font-hebrew text-xl font-medium text-nyahu-gold/80" dir="rtl">
              נְיָהוּ
            </span>
            <span className="animate-blink font-pixel text-[9px] text-nyahu-gold">PUSH START</span>
          </motion.div>
        )}
        </motion.div>
      </div>

      <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-pixel text-[8px] text-slate-500">
        CLICK TO SKIP
      </span>
    </div>
  );
}
