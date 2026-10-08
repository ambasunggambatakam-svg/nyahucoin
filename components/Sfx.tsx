"use client";

import { useEffect } from "react";
import { play } from "@/lib/sfx";

export default function Sfx() {
  useEffect(() => {
    let lastEl: Element | null = null;
    let lastTime = 0;

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const btn = target?.closest?.("a, button, [role=button]");
      if (!btn) return;
      const now = performance.now();
      if (btn === lastEl && now - lastTime < 600) return;
      lastEl = btn;
      lastTime = now;
      play("hover");
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.("a, button, [role=button]")) play("click");
    };

    window.addEventListener("pointerover", onOver, true);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("pointerover", onOver, true);
      window.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
