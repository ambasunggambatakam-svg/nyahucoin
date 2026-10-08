"use client";

import { motion } from "framer-motion";

export type Burst = { key: number; x: number; y: number };

const COUNT = 36;
const COLORS = ["#d4af37", "#f5d76e", "#2f6bff", "#ffffff", "#0038b8"];

export default function PixelConfetti({ burst }: { burst: Burst | null }) {
  if (!burst) return null;

  return (
    <div key={burst.key} className="pointer-events-none fixed inset-0 z-[80]" aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => {
        const angle = (i / COUNT) * Math.PI * 2 + ((i % 7) - 3) * 0.12;
        const dist = 70 + ((i * 37) % 90);
        const size = 4 + (i % 3) * 3;
        const spin = (i % 2 === 0 ? 1 : -1) * (90 + (i % 4) * 60);
        const dx = Math.cos(angle) * dist;
        const fall = Math.sin(angle) * dist * 0.6 + 120;
        return (
          <motion.span
            key={i}
            className="absolute top-0 left-0 block"
            style={{ width: size, height: size, background: COLORS[i % COLORS.length] }}
            initial={{ x: burst.x, y: burst.y, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: burst.x + dx,
              y: burst.y + fall,
              opacity: 0,
              scale: 0.3,
              rotate: spin,
            }}
            transition={{
              x: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 1, ease: [0.4, 0, 0.9, 0.5] },
              opacity: { duration: 1, delay: 0.35 },
              scale: { duration: 1 },
              rotate: { duration: 1, ease: "easeIn" },
            }}
          />
        );
      })}
    </div>
  );
}
