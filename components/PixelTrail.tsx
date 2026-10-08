"use client";

import { useEffect, useRef } from "react";

export default function PixelTrail() {
  const activeRef = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const dots: Array<HTMLSpanElement> = [];
    const pool: HTMLSpanElement[] = [];
    const last = { x: -999, y: -999, t: 0 };

    for (let i = 0; i < 9; i++) {
      const d = document.createElement("span");
      d.className = "pixel-dot";
      d.style.setProperty("--life", String(0.5 + (i * 0.07)));
      d.style.setProperty("--delay", String(i * 0.022));
      Object.assign(d.style, {
        position: "fixed",
        top: "-10px",
        left: "-10px",
        width: "3px",
        height: "3px",
        background: i % 2 === 0 ? "#d4af37" : "#f5d76e",
        boxShadow: "1px 1px 0 0 rgba(0,0,0,0.6)",
        pointerEvents: "none",
        zIndex: "9999",
      });
      dots.push(d);
      document.body.appendChild(d);
    }

    const spawn = (x: number, y: number) => {
      if (activeRef.current) return;
      activeRef.current = true;
      let idx = 0;
      const tick = (ts: number) => {
        if (ts - last.t > 16) {
          last.t = ts;
          const el = pool.pop() || dots[idx++ % dots.length];
          if (el) {
            el.style.setProperty("--x", x + "px");
            el.style.setProperty("--y", y + "px");
            el.dataset.alive = "1";
            setTimeout(() => {
              el.dataset.alive = "0";
              pool.push(el);
            }, 520);
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      last.x = e.clientX;
      last.y = e.clientY;
      const mag = Math.hypot((e.movementX ?? 0), (e.movementY ?? 0));
      if (mag > 1.4) spawn(last.x, last.y);
    };
    const onUp = () => {
      cancelAnimationFrame(raf);
      activeRef.current = false;
    };
    const onDown = (e: MouseEvent) => spawn(e.clientX, e.clientY);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
      dots.forEach((d) => d.remove());
      pool.forEach((d) => d.remove());
    };
  }, []);

  return null;
}
