"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import BootLoader from "./BootLoader";
import PixelCursor from "./PixelCursor";
import Sfx from "./Sfx";
import PixelTrail from "./PixelTrail";

const EXIT = 0.65;
const BootPadContext = createContext(0);

export function useBootPad() {
  return useContext(BootPadContext);
}

export default function Shell({ children }: { children: ReactNode }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [phase, setPhase] = useState<"boot" | "exit" | "done">("boot");
  const loading = !reduced && phase !== "done";
  const pad = loading ? EXIT : 0;

  const handleExit = useCallback(() => setPhase("exit"), []);
  const handleDone = useCallback(() => setPhase("done"), []);

  useEffect(() => {
    if (!loading) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <BootPadContext.Provider value={pad}>
      {!loading || phase === "exit" ? children : null}
      {loading && <BootLoader onExit={handleExit} onDone={handleDone} />}
      <Sfx />
      <PixelTrail />
      <PixelCursor />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(3,7,26,0.4)_100%)]"
      />
    </BootPadContext.Provider>
  );
}
