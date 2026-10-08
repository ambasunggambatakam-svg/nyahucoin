"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import Magnetic from "./Magnetic";
import PixelConfetti, { type Burst } from "./PixelConfetti";

const LINKS = [
  { label: "Vision", href: "#vision", id: "vision" },
  { label: "Tokenomics", href: "#tokenomics", id: "tokenomics" },
  { label: "Roadmap", href: "#roadmap", id: "roadmap" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [burst, setBurst] = useState<Burst | null>(null);
  const lastY = useRef(0);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  useEffect(() => {
    return () => {
      if (burstTimer.current) clearTimeout(burstTimer.current);
    };
  }, []);

  const fire = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setBurst({ key: Date.now(), x: e.clientX, y: e.clientY });
    if (burstTimer.current) clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => setBurst(null), 1400);
  };

  useMotionValueEvent(scrollY, "change", (y) => {
    setHidden(y > lastY.current && y > 140);
    lastY.current = y;
  });

  useEffect(() => {
    const ids = ["hero", "vision", "tokenomics", "roadmap", "buy"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[4px] bg-white/10" aria-hidden="true">
        <motion.div
          style={{ width: progressWidth }}
          className="h-full bg-[repeating-linear-gradient(90deg,#d4af37_0_10px,#f5d76e_10px_14px)] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
        />
      </div>

      <motion.header
        animate={{ y: hidden ? "-120%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav className="glass mx-auto mt-4 flex max-w-6xl items-center justify-between px-4 py-3 shadow-[5px_5px_0_0_rgba(0,56,184,0.45)] sm:px-6">
          <a
            href="#hero"
            className="flex items-baseline gap-2.5 font-heading text-lg font-bold tracking-widest text-nyahu-gold glow-gold"
          >
            NYAHUCOIN
            <span className="hidden font-hebrew text-xs font-medium text-nyahu-gold/70 sm:inline">
              נְיָהוּ
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative font-pixel text-[10px] transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-nyahu-gold after:transition-all after:duration-300 after:content-[''] ${
                  active === link.id
                    ? "text-nyahu-gold after:w-full"
                    : "text-slate-300 after:w-0 hover:text-nyahu-gold hover:after:w-full"
                }`}
              >
                {link.label}
                {active === link.id && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-2.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 bg-nyahu-gold shadow-[0_0_8px_rgba(212,175,55,0.9)]"
                  />
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Magnetic>
              <a
                href="#buy"
                onClick={fire}
                className="hidden animate-pixel-pulse border-2 border-black/50 bg-nyahu-blue px-5 py-2.5 font-pixel text-[10px] text-white transition-transform hover:translate-x-1 hover:translate-y-1 sm:block"
              >
                Buy Now
              </a>
            </Magnetic>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-none border-2 border-white/15 p-2 text-slate-200 transition-colors hover:border-nyahu-gold/60 hover:text-nyahu-gold md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mx-3 mt-2 flex flex-col gap-1 p-3 shadow-[4px_4px_0_0_rgba(0,56,184,0.45)] md:hidden"
          >
            {LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.3, ease: "easeOut" }}
                className={`border-2 px-3 py-2.5 font-pixel text-[10px] transition-colors ${
                  active === link.id
                    ? "border-nyahu-gold/40 text-nyahu-gold"
                    : "border-transparent text-slate-200 hover:text-nyahu-gold"
                }`}
              >
                {link.label}
              </motion.a>
            ))}
            <a
              href="#buy"
              onClick={(e) => {
                fire(e);
                setOpen(false);
              }}
              className="mt-1 border-2 border-black/50 bg-nyahu-blue px-5 py-3 text-center font-pixel text-[10px] text-white shadow-[4px_4px_0_0_#0055ff]"
            >
              Buy Now
            </a>
          </motion.div>
        )}
      </motion.header>
      <PixelConfetti burst={burst} />
    </>
  );
}
