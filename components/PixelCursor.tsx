"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function PixelCursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ringIdx = useRef(0);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const ringX = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 500, damping: 40, mass: 0.6 });
  const dotX = useSpring(mx, { stiffness: 1400, damping: 90 });
  const dotY = useSpring(my, { stiffness: 1400, damping: 90 });

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setHovered(!!target?.closest?.("a, button, [role=button]"));
    };
    const onDown = (e: MouseEvent) => {
      setPressed(true);
      const ring = ringsRef.current[ringIdx.current % 3];
      ringIdx.current += 1;
      if (ring) {
        ring.style.left = `${e.clientX}px`;
        ring.style.top = `${e.clientY}px`;
        ring.classList.remove("shock-active");
        void ring.offsetWidth;
        ring.classList.add("shock-active");
      }
    };
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [fine, mx, my]);

  if (!fine) return null;

  return (
    <>
      <motion.div
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[10000]"
        aria-hidden="true"
      >
        <motion.div
          animate={{
            scale: hovered ? 1.7 : pressed ? 0.65 : 1,
            rotate: hovered ? 45 : 0,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          className="-mt-3 -ml-3 h-6 w-6 border-2 border-nyahu-gold shadow-[0_0_12px_rgba(212,175,55,0.55)]"
        />
      </motion.div>
      <motion.div
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[10000]"
        aria-hidden="true"
      >
        <div className="-mt-[2px] -ml-[2px] h-1 w-1 bg-nyahu-gold-light" />
      </motion.div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            ringsRef.current[i] = el;
          }}
          aria-hidden="true"
          className="shock-ring pointer-events-none fixed top-0 left-0 z-[10000]"
        />
      ))}
    </>
  );
}
