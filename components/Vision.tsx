"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import SplitWords from "./SplitWords";

const Coin3D = dynamic(() => import("./Coin3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-nyahu-gold/40">
      <span className="font-pixel text-[8px] text-nyahu-gold/60">LOADING...</span>
    </div>
  ),
});

export default function Vision() {
  const tiltRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 160, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 160, damping: 18 });

  const handleTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 18);
    rotateX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 18);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section id="vision" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
      <Reveal>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span className="font-pixel text-[10px] text-nyahu-gold uppercase">The Vision</span>
              <span className="h-px w-16 bg-nyahu-gold/40" aria-hidden="true" />
              <span className="font-hebrew text-base font-medium text-nyahu-gold/70" dir="rtl">
                חָזוֹן
              </span>
            </div>
            <h2 className="font-heading mt-4 text-3xl font-bold text-white sm:text-5xl">
              <SplitWords text="A Legacy Reborn" stagger={0.08} />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-lg leading-relaxed text-slate-400"
            >
              NyahuCoin isn&apos;t just a token; it&apos;s a historical inevitability. Forged in
              the fires of the Mediterranean and backed by the undeniable spirit of Tel
              Aviv&apos;s degens, we are taking over the blockchain.
            </motion.p>
          </div>

          <Reveal delay={0.15}>
            <div style={{ perspective: 1000 }}>
              <motion.div
                ref={tiltRef}
                onPointerMove={handleTilt}
                onPointerLeave={resetTilt}
                style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
                className="glass-gold relative flex aspect-square items-center justify-center overflow-hidden shadow-[8px_8px_0_0_rgba(0,56,184,0.5)]"
              >
                <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden="true" />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2 left-2 h-5 w-5 border-t-2 border-l-2 border-nyahu-gold/70"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2 right-2 h-5 w-5 border-t-2 border-r-2 border-nyahu-gold/70"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-nyahu-gold/70"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 bottom-2 h-5 w-5 border-r-2 border-b-2 border-nyahu-gold/70"
                />

                <div
                  className="pointer-events-none absolute inset-4 border border-dashed border-nyahu-gold/30 animate-orbit"
                  aria-hidden="true"
                >
                  <span className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-nyahu-gold shadow-glow-gold" />
                </div>
                <div
                  className="pointer-events-none absolute inset-12 border border-dashed border-nyahu-blue-bright/40 animate-orbit-slow"
                  aria-hidden="true"
                >
                  <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 bg-nyahu-blue-bright shadow-glow-blue" />
                </div>

                <div className="absolute top-6 left-6 text-nyahu-gold/50" aria-hidden="true">
                  <Sparkles size={22} />
                </div>
                <div className="absolute right-6 bottom-6 text-nyahu-gold/50" aria-hidden="true">
                  <Sparkles size={16} />
                </div>

                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="h-40 w-40 sm:h-52 sm:w-52">
                    <Coin3D />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-pixel text-[10px] tracking-wider text-nyahu-gold">
                      EST. 1000 BC
                    </span>
                    <span className="font-hebrew text-sm text-nyahu-gold/70" dir="rtl">
                      לִפְנֵי 3000 שָׁנָה
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
