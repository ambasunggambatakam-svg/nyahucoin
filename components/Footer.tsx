"use client";

import { Send, X } from "lucide-react";
import PixelStar from "./PixelStar";
import Reveal from "./Reveal";

const SOCIALS = [
  { label: "Twitter / X", href: "https://x.com/nyahucoin", icon: X },
  { label: "Telegram", href: "https://t.me/nyahucoin", icon: Send },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-nyahu-gold/30 bg-abyss-soft/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6">
        <Reveal>
          <p
            aria-hidden="true"
            className="font-heading shine-text mb-4 text-center text-[clamp(2.5rem,12vw,8.5rem)] leading-none font-bold opacity-30 select-none transition-opacity duration-500 hover:opacity-60"
          >
            NYAHUCOIN
          </p>
          <div className="mb-12 flex items-center justify-center gap-3">
            <PixelStar className="h-3 w-3 text-nyahu-gold/70" />
            <span className="font-hebrew text-base font-medium text-nyahu-gold/70" dir="rtl">
              עַד הַיָּרֵחַ
            </span>
            <PixelStar className="h-3 w-3 text-nyahu-gold/70" />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="glass p-3 text-slate-300 transition-all hover:-translate-y-1 hover:border-nyahu-gold/60 hover:text-nyahu-gold hover:shadow-[4px_4px_0_0_rgba(212,175,55,0.55)]"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500">
            © 2026 NyahuCoin. All rights reserved. Not financial advice.
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
