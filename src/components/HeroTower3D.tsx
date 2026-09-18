"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Group } from "three";
import * as THREE from "three";

const BLOCK_COUNT = 18;

const COLORS = {
  front: "#4a7de8",
  side: "#a9bff5",
  top: "#152a63",
  back: "#3a62c4",
};

function blockScale(index: number) {
  const t = index / (BLOCK_COUNT - 1);
  const waist = 0.38;
  const curve = Math.abs(t - 0.64);
  return waist + curve * 1.22;
}

function SceneSetup() {
  const { gl } = useThree();

  useEffect(() => {
    gl.shadowMap.enabled = false;
  }, [gl]);

  return null;
}

function SpiralTower() {
  const group = useRef<Group>(null);

  const blocks = useMemo(
    () =>
      Array.from({ length: BLOCK_COUNT }, (_, index) => ({
        index,
        scale: blockScale(index),
        y: (index - (BLOCK_COUNT - 1) / 2) * 0.28,
        rotation: (index * 13.5 * Math.PI) / 180,
      })),
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.35;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      0.32 + state.pointer.y * -0.2,
      0.08,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      state.pointer.x * 0.08,
      0.08,
    );
  });

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      {blocks.map((block) => (
        <mesh
          key={block.index}
          position={[0, block.y, 0]}
          rotation={[0, block.rotation, 0]}
          scale={[block.scale, 1, 1]}
        >
          <boxGeometry args={[2.2, 0.26, 0.72]} />
          <meshStandardMaterial attach="material-0" color={COLORS.side} roughness={0.38} metalness={0.08} />
          <meshStandardMaterial attach="material-1" color={COLORS.side} roughness={0.38} metalness={0.08} />
          <meshStandardMaterial attach="material-2" color={COLORS.top} roughness={0.5} metalness={0.05} />
          <meshStandardMaterial attach="material-3" color={COLORS.top} roughness={0.55} metalness={0.05} />
          <meshStandardMaterial attach="material-4" color={COLORS.front} roughness={0.3} metalness={0.12} />
          <meshStandardMaterial attach="material-5" color={COLORS.back} roughness={0.4} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroTower3D() {
  return (
    <div className="relative h-full w-full bg-transparent">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [3.2, 2.4, 4.2], fov: 36, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop="always"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <SceneSetup />
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 7, 3]} intensity={1.35} />
        <directionalLight position={[-3, 2, -2]} intensity={0.55} color="#c7d7fb" />
        <SpiralTower />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.45, 0]}>
          <circleGeometry args={[2.2, 48]} />
          <meshBasicMaterial color="#d7dde5" transparent opacity={0.45} />
        </mesh>
      </Canvas>
    </div>
  );
}
