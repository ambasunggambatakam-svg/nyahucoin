"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useMediaQuery from "@/hooks/useMediaQuery";

const MOON_R = 2.6;
const STEP = 0.34;
const HOLE = { cx: 1.35, cy: 0.5, cz: 0.75, r: 2.15 };
const dummy = new THREE.Object3D();

type Vox = { x: number; y: number; z: number; color: THREE.Color };

function buildMoon(): Vox[] {
  let seed = 9001;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const top = new THREE.Color("#f7e39b");
  const mid = new THREE.Color("#e8c74e");
  const low = new THREE.Color("#a8862f");
  const out: Vox[] = [];
  const n = Math.ceil(MOON_R / STEP);
  for (let xi = -n; xi <= n; xi++) {
    for (let yi = -n; yi <= n; yi++) {
      for (let zi = -n; zi <= n; zi++) {
        const x = xi * STEP;
        const y = yi * STEP;
        const z = zi * STEP;
        const d = Math.sqrt(x * x + y * y + z * z);
        if (Math.abs(d - MOON_R) > STEP * 0.85) continue;
        const hx = x - HOLE.cx;
        const hy = y - HOLE.cy;
        const hz = z - HOLE.cz;
        if (Math.sqrt(hx * hx + hy * hy + hz * hz) < HOLE.r) continue;
        const t = (y + MOON_R) / (MOON_R * 2);
        const base = t > 0.55 ? top.clone().lerp(mid, (1 - t) / 0.45) : low.clone().lerp(mid, t / 0.55);
        base.multiplyScalar(0.92 + rand() * 0.16);
        out.push({ x, y, z, color: base });
      }
    }
  }
  return out;
}

type Rain = { x: number; y: number; z: number; speed: number; rot: number; scale: number; color: THREE.Color };

function buildRain(): Rain[] {
  const golds = ["#d4af37", "#f5d76e", "#c9a331"].map((c) => new THREE.Color(c));
  const blue = new THREE.Color("#2f6bff");
  let seed = 555;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 42 }, () => ({
    x: (rand() - 0.5) * 9,
    y: rand() * 11 - 5.5,
    z: -3 + rand() * 4,
    speed: 0.5 + rand() * 1.1,
    rot: (rand() - 0.5) * 2.4,
    scale: 0.45 + rand() * 0.65,
    color: rand() < 0.85 ? golds[Math.floor(rand() * golds.length)] : blue,
  }));
}

function Moon({ reduced, wide }: { reduced: boolean; wide: boolean }) {
  const moonRef = useRef<THREE.InstancedMesh>(null);
  const moonGroup = useRef<THREE.Group>(null);
  const rainRef = useRef<THREE.InstancedMesh>(null);
  const voxels = useMemo(() => buildMoon(), []);
  const rain = useMemo(() => buildRain(), []);
  const rainY = useRef<number[]>([]);
  const baseY = useRef(0);

  useEffect(() => {
    rainY.current = rain.map((r) => r.y);
  }, [rain]);

  useEffect(() => {
    const moon = moonRef.current;
    if (moon) {
      voxels.forEach((v, i) => {
        dummy.position.set(v.x, v.y, v.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        moon.setMatrixAt(i, dummy.matrix);
        moon.setColorAt(i, v.color);
      });
      moon.instanceMatrix.needsUpdate = true;
      if (moon.instanceColor) moon.instanceColor.needsUpdate = true;
    }
    const r = rainRef.current;
    if (r) {
      rain.forEach((it, i) => {
        dummy.position.set(it.x, it.y, it.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(it.scale);
        dummy.updateMatrix();
        r.setMatrixAt(i, dummy.matrix);
        r.setColorAt(i, it.color);
      });
      r.instanceMatrix.needsUpdate = true;
      if (r.instanceColor) r.instanceColor.needsUpdate = true;
    }
  }, [voxels, rain]);

  useEffect(() => {
    const g = moonGroup.current;
    if (!g) return;
    const y = wide ? 1.3 : 3.4;
    g.position.set(wide ? 4.6 : 0, y, wide ? 0 : -0.5);
    g.scale.setScalar(wide ? 1.25 : 0.85);
    baseY.current = y;
  }, [wide]);

  useFrame((state, delta) => {
    if (reduced) return;
    const g = moonGroup.current;
    const t = state.clock.elapsedTime;
    if (g) {
      g.rotation.y += delta * 0.22;
      g.rotation.z = 0.1;
      g.position.y = baseY.current + Math.sin(t * 0.8) * 0.14;
    }
    const r = rainRef.current;
    const ys = rainY.current;
    if (r && ys.length === rain.length) {
      rain.forEach((it, i) => {
        let y = ys[i] - it.speed * delta;
        if (y < -5.5) y = 5.5;
        ys[i] = y;
        dummy.position.set(it.x, y, it.z);
        dummy.rotation.set(t * it.rot, t * it.rot * 0.6, 0);
        dummy.scale.setScalar(it.scale);
        dummy.updateMatrix();
        r.setMatrixAt(i, dummy.matrix);
      });
      r.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <group ref={moonGroup}>
        <instancedMesh ref={moonRef} args={[undefined!, undefined!, voxels.length]}>
          <boxGeometry args={[0.32, 0.32, 0.32]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      </group>
      <instancedMesh ref={rainRef} args={[undefined!, undefined!, rain.length]}>
        <boxGeometry args={[1, 0.12, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  );
}

export default function MoonScene() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 768px)");
  const holderRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={holderRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance", preserveDrawingBuffer: true }}
        frameloop={inView ? "always" : "never"}
        style={{ width: "100%", height: "100%" }}
      >
        <Moon reduced={reduced} wide={wide} />
      </Canvas>
    </div>
  );
}
