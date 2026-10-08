"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useMediaQuery from "@/hooks/useMediaQuery";

const R = 8;
const LAYERS = 4;
const dummy = new THREE.Object3D();
const N_PATTERN = ["10001", "11001", "10101", "10011", "10001"];

function inN(x: number, y: number, mirrored: boolean) {
  const px = mirrored ? -x : x;
  if (Math.abs(px) > 2 || Math.abs(y) > 2) return false;
  const row = 2 - y;
  const col = px + 2;
  return N_PATTERN[row][col] === "1";
}

type Voxel = { x: number; y: number; z: number; scale: number; color: THREE.Color };

function buildVoxels(): Voxel[] {
  const golds = ["#d4af37", "#c9a331", "#e8c74e", "#bd9529"].map((c) => new THREE.Color(c));
  const rim = new THREE.Color("#8a7020");
  const rimLight = new THREE.Color("#b8963f");
  const blue = new THREE.Color("#0038b8");
  const blueBright = new THREE.Color("#2f6bff");
  const shadow = new THREE.Color("#6e5a1e");
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const out: Voxel[] = [];
  for (let x = -R; x <= R; x++) {
    for (let y = -R; y <= R; y++) {
      const d2 = x * x + y * y;
      if (d2 > R * R) continue;
      const dist = Math.sqrt(d2);
      const bevel = dist > R - 0.5;
      for (let zi = 0; zi < LAYERS; zi++) {
        const isFront = zi === LAYERS - 1;
        const isBack = zi === 0;
        const isFace = isFront || isBack;
        let z = zi - (LAYERS - 1) / 2;
        let scale = bevel ? 0.86 : 1;
        let color: THREE.Color;
        if (isFace && inN(x, y, isBack)) {
          color = rand() > 0.5 ? blue : blueBright;
          scale = 0.94;
          z += isFront ? 0.42 : -0.42;
        } else if (dist > R - 1) {
          color = (x + y + zi) % 2 === 0 ? rim : rimLight;
        } else if (!isFace) {
          color = shadow;
        } else {
          color = golds[Math.floor(rand() * golds.length)];
        }
        out.push({ x, y, z, scale, color });
      }
    }
  }
  return out;
}

type Sparkle = {
  angle: number;
  radius: number;
  y: number;
  speed: number;
  scale: number;
  phase: number;
  color: THREE.Color;
};

function buildSparkles(): Sparkle[] {
  const palette = ["#f5d76e", "#d4af37", "#2f6bff", "#e8eefc"].map((c) => new THREE.Color(c));
  let seed = 777;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 26 }, (_, i) => ({
    angle: (i / 26) * Math.PI * 2 + rand() * 0.6,
    radius: 6.2 + rand() * 1.1,
    y: (rand() - 0.5) * 3.4,
    speed: 0.3 + rand() * 0.55,
    scale: 0.14 + rand() * 0.2,
    phase: rand() * Math.PI * 2,
    color: palette[Math.floor(rand() * palette.length)],
  }));
}

function VoxelCoin({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const voxels = useMemo(() => buildVoxels(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    voxels.forEach((v, i) => {
      dummy.position.set(v.x, v.y, v.z);
      dummy.scale.setScalar(v.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, v.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [voxels]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (reduced) {
      g.rotation.y = 0.6;
      g.rotation.x = 0.2;
      return;
    }
    g.rotation.y += delta * 0.55;
    const t = state.clock.elapsedTime;
    g.position.y = Math.sin(t * 1.2) * 0.35;
    const targetX = 0.2 + -state.pointer.y * 0.35;
    const targetZ = state.pointer.x * 0.15;
    const k = Math.min(1, delta * 3);
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.rotation.z += (targetZ - g.rotation.z) * k;
  });

  return (
    <group ref={groupRef} scale={0.85}>
      <instancedMesh ref={meshRef} args={[undefined!, undefined!, voxels.length]}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial metalness={0.7} roughness={0.32} flatShading />
      </instancedMesh>
    </group>
  );
}

function Sparkles({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const items = useMemo(() => buildSparkles(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    items.forEach((s, i) => {
      dummy.position.set(Math.cos(s.angle) * s.radius, s.y, Math.sin(s.angle) * s.radius);
      dummy.rotation.set(s.phase, s.phase, 0);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, s.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const ring = ringRef.current;
    if (!mesh || !ring) return;
    if (reduced) return;
    const t = state.clock.elapsedTime;
    ring.rotation.y -= delta * 0.35;
    items.forEach((s, i) => {
      const a = s.angle + t * s.speed;
      dummy.position.set(
        Math.cos(a) * s.radius,
        s.y + Math.sin(t * 1.4 + s.phase) * 0.4,
        Math.sin(a) * s.radius,
      );
      dummy.rotation.set(t * s.speed * 2 + s.phase, t * s.speed, 0);
      const pulse = s.scale * (0.7 + 0.45 * (0.5 + 0.5 * Math.sin(t * 3 + s.phase)));
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={ringRef} rotation={[0.45, 0, -0.25]}>
      <instancedMesh ref={meshRef} args={[undefined!, undefined!, items.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

export default function Coin3D() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <Canvas
      camera={{ position: [0, 0, 19], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance", preserveDrawingBuffer: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 8, 10]} intensity={1.7} color="#fff8e6" />
      <directionalLight position={[-8, 3, -9]} intensity={1.1} color="#8fb0ff" />
      <pointLight position={[-7, -4, 6]} intensity={90} distance={45} color="#2f6bff" />
      <pointLight position={[7, 5, 9]} intensity={45} distance={45} color="#f5d76e" />
      <VoxelCoin reduced={reduced} />
      <Sparkles reduced={reduced} />
    </Canvas>
  );
}
