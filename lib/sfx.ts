const KEY = "nyahu-sfx";

let ctx: AudioContext | null = null;
let enabled = false;
const subs = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    enabled = window.localStorage.getItem(KEY) === "on";
  } catch {
    enabled = false;
  }
}

function emit() {
  for (const cb of subs) cb();
}

export function subscribe(cb: () => void) {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

export function getEnabled() {
  return enabled;
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") {
    void ctx.resume().catch(() => {});
  }
  return ctx;
}

function blip(freq: number, dur: number, vol: number, when = 0, type: OscillatorType = "square") {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

export type SfxName = "hover" | "click" | "coin" | "boot";

export function play(name: SfxName) {
  if (name === "hover") {
    blip(740, 0.05, 0.02);
  } else if (name === "click") {
    blip(880, 0.05, 0.03);
    blip(1175, 0.07, 0.025, 0.05);
  } else if (name === "coin") {
    blip(988, 0.07, 0.03);
    blip(1319, 0.09, 0.03, 0.07);
    blip(1568, 0.15, 0.025, 0.15);
  } else {
    blip(220, 0.1, 0.025, 0, "sawtooth");
    blip(440, 0.12, 0.03, 0.1);
  }
}

export function setEnabled(v: boolean) {
  enabled = v;
  try {
    window.localStorage.setItem(KEY, v ? "on" : "off");
  } catch {
    /* storage unavailable */
  }
  emit();
  if (v) play("coin");
}
