"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useMediaQuery from "@/hooks/useMediaQuery";

const COUNT = 110;
const dummy = new THREE.Object3D();

type Cube = {
  base: THREE.Vector3;
  spin: THREE.Vector3;
  bob: number;
  phase: number;
  color: THREE.Color;
  scale: number;
};

function buildCubes(): Cube[] {
  const blues = ["#0038b8", "#0a2f96", "#0e42c9", "#00246e"].map((c) => new THREE.Color(c));
  const golds = ["#d4af37", "#f5d76e", "#8a7020"].map((c) => new THREE.Color(c));
  const pale = new THREE.Color("#e8eefc");
  let seed = 12345;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  return Array.from({ length: COUNT }, () => {
    const x = (rand() - 0.5) * 18;
    const y = (rand() - 0.5) * 11;
    const z = -6 + rand() * 7;
    const roll = rand();
    let color =
      roll < 0.55 ? blues[Math.floor(rand() * blues.length)] : roll < 0.87 ? golds[Math.floor(rand() * golds.length)] : pale;
    if (z < -3) color = color.clone().multiplyScalar(0.55);
    return {
      base: new THREE.Vector3(x, y, z),
      spin: new THREE.Vector3((rand() - 0.5) * 0.5, (rand() - 0.5) * 0.5, (rand() - 0.5) * 0.5),
      bob: 0.15 + rand() * 0.4,
      phase: rand() * Math.PI * 2,
      color,
      scale: rand() < 0.1 ? 0.6 + rand() * 0.35 : 0.14 + rand() * 0.36,
    };
  });
}

function Field({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const cubes = useMemo(() => buildCubes(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    cubes.forEach((c, i) => {
      dummy.position.copy(c.base);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(c.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, c.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [cubes]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;
    if (reduced) return;
    const t = state.clock.elapsedTime;
    cubes.forEach((c, i) => {
      dummy.position.set(c.base.x, c.base.y + Math.sin(t * c.bob + c.phase) * c.bob, c.base.z);
      dummy.rotation.set(t * c.spin.x, t * c.spin.y, t * c.spin.z);
      dummy.scale.setScalar(c.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    const k = Math.min(1, delta * 2.2);
    group.rotation.y += (state.pointer.x * 0.09 - group.rotation.y) * k;
    group.rotation.x += (-state.pointer.y * 0.05 - group.rotation.x) * k;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined!, undefined!, cubes.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

export default function VoxelField() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
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
        camera={{ position: [0, 0, 9], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance", preserveDrawingBuffer: true }}
        frameloop={inView ? "always" : "never"}
        style={{ width: "100%", height: "100%" }}
      >
        <Field reduced={reduced} />
      </Canvas>
    </div>
  );
}
