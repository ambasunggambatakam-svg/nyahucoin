"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import PixelStar from "./PixelStar";

type Token = { text?: string; he?: boolean };

const TOKENS: Token[] = [
  {},
  { text: "NYAHUCOIN" },
  {},
  { text: "SHALOM TO THE MOON" },
  {},
  { text: "0% TAX" },
  {},
  { text: "LP BURNED" },
  {},
  { text: "THE PROMISED COIN" },
  {},
  { text: "תֵּל אָבִיב", he: true },
  {},
  { text: "נְיָהוּ", he: true },
  {},
];

function Band({ variant }: { variant: "blue" | "gold" }) {
  const tone =
    variant === "blue"
      ? {
          wrap: "animate-marquee border-y-2 border-nyahu-gold/60 bg-nyahu-blue py-3.5 text-white shadow-[0_0_28px_rgba(0,56,184,0.6)]",
          star: "text-nyahu-gold-light",
          text: "text-white",
          he: "text-nyahu-gold-light",
        }
      : {
          wrap: "animate-marquee-reverse border-y-2 border-abyss/40 bg-nyahu-gold py-3.5 text-abyss shadow-[0_0_28px_rgba(212,175,55,0.5)]",
          star: "text-nyahu-blue",
          text: "text-abyss",
          he: "text-nyahu-blue",
        };

  return (
    <div className={tone.wrap}>
      <div className="flex w-max items-center">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center">
            {TOKENS.map((token, index) =>
              token.text ? (
                <span
                  key={`${copy}-${index}`}
                  className={`mx-3 whitespace-nowrap ${
                    token.he
                      ? `font-hebrew text-base font-medium sm:text-xl ${tone.he}`
                      : `font-pixel text-[11px] sm:text-sm ${tone.text}`
                  }`}
                >
                  {token.text}
                </span>
              ) : (
                <PixelStar
                  key={`${copy}-${index}`}
                  className={`mx-3 h-3.5 w-3.5 shrink-0 ${tone.star}`}
                />
              ),
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const rawSkew = useTransform(velocity, [-1500, 0, 1500], [4, 0, -4], { clamp: true });
  const skew = useSpring(rawSkew, { stiffness: 220, damping: 28 });

  return (
    <motion.div
      style={{ skewY: skew }}
      className="relative overflow-hidden py-8 select-none"
      aria-hidden="true"
    >
      <div className="-mt-4 -rotate-2 scale-110">
        <Band variant="blue" />
      </div>
      <div className="-mt-3 rotate-2 scale-110">
        <Band variant="gold" />
      </div>
    </motion.div>
  );
}
