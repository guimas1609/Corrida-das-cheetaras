"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

const PINK = new THREE.Color("#f02090");
const PURPLE = new THREE.Color("#602088");
const DARK = new THREE.Color("#241528");

/** Low-poly geometry with a per-vertex gradient along one axis. */
function useGradientGeometry(
  geometry: THREE.BufferGeometry,
  colorA: THREE.Color,
  colorB: THREE.Color,
  axis: "x" | "y" | "z" = "x"
) {
  return useMemo(() => {
    const geo = geometry.clone();
    geo.computeBoundingBox();
    const bbox = geo.boundingBox!;
    const min = bbox.min[axis];
    const max = bbox.max[axis];
    const pos = geo.attributes.position;
    const colors: number[] = [];
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const v =
        axis === "x" ? pos.getX(i) : axis === "y" ? pos.getY(i) : pos.getZ(i);
      const t = (v - min) / (max - min);
      c.lerpColors(colorA, colorB, t);
      colors.push(c.r, c.g, c.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, colorA, colorB, axis]);
}

const gradientMat = (
  <meshStandardMaterial vertexColors flatShading roughness={0.35} metalness={0.15} />
);

const SPOTS: Array<[number, number, number, number]> = [
  [0.15, 0.42, 0.68, 0.075],
  [0.4, 0.18, 0.72, 0.065],
  [0.35, -0.15, 0.7, 0.07],
  [0.05, -0.35, 0.68, 0.06],
  [-0.25, 0.1, 0.75, 0.055],
];

const SCROLL_ROTATION_START = -1.4;
const SCROLL_ROTATION_END = -0.5;

function JaguarHead({ progress }: { progress?: number }) {
  const group = useRef<THREE.Group>(null);

  const craniumBase = useMemo(() => new THREE.IcosahedronGeometry(0.78, 1), []);
  const craniumGeo = useGradientGeometry(craniumBase, PURPLE, PINK, "x");

  const muzzleBase = useMemo(() => new THREE.ConeGeometry(0.42, 1.15, 6), []);
  const muzzleGeo = useGradientGeometry(muzzleBase, PURPLE, PINK, "y");

  const earBase = useMemo(() => new THREE.ConeGeometry(0.24, 0.58, 4), []);
  const earGeo = useGradientGeometry(earBase, PURPLE, PINK, "y");

  useFrame((_, delta) => {
    if (!group.current) return;
    if (progress !== undefined) {
      const target = THREE.MathUtils.lerp(
        SCROLL_ROTATION_START,
        SCROLL_ROTATION_END,
        progress
      );
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        target,
        6,
        delta
      );
    } else {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group
      ref={group}
      rotation={[0, progress !== undefined ? SCROLL_ROTATION_START : -0.5, 0]}
    >
      {/* Cranium */}
      <mesh geometry={craniumGeo} scale={[0.9, 0.85, 0.95]} castShadow receiveShadow>
        {gradientMat}
      </mesh>

      {/* Muzzle (cone rotated to point forward, tilted slightly down) */}
      <mesh
        geometry={muzzleGeo}
        position={[0.55, -0.12, 0]}
        rotation={[0, 0, -Math.PI / 2 - 0.22]}
        castShadow
      >
        {gradientMat}
      </mesh>

      {/* Nose tip */}
      <mesh position={[1.15, -0.32, 0]} scale={0.11}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={DARK} flatShading roughness={0.5} />
      </mesh>

      {/* Lower jaw */}
      <mesh position={[0.55, -0.42, 0]} rotation={[0, 0, Math.PI]} scale={[0.3, 0.22, 0.32]} castShadow>
        <coneGeometry args={[0.55, 0.6, 5]} />
        <meshStandardMaterial color={PINK} flatShading roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Ears */}
      <mesh
        geometry={earGeo}
        position={[-0.35, 0.68, 0.4]}
        rotation={[0.15, 0, -0.35]}
        castShadow
      >
        {gradientMat}
      </mesh>
      <mesh
        geometry={earGeo}
        position={[-0.35, 0.68, -0.4]}
        rotation={[-0.15, 0, -0.35]}
        castShadow
      >
        {gradientMat}
      </mesh>

      {/* Eyes */}
      <mesh position={[0.42, 0.12, 0.42]} scale={0.08}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={DARK} roughness={0.2} />
      </mesh>
      <mesh position={[0.42, 0.12, -0.42]} scale={0.08}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={DARK} roughness={0.2} />
      </mesh>

      {/* Spots (cheeks, mirrored front/back) */}
      {SPOTS.map(([x, y, z, s], i) => (
        <mesh key={`f${i}`} position={[x, y, z]} scale={s}>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color={PURPLE} flatShading roughness={0.4} />
        </mesh>
      ))}
      {SPOTS.map(([x, y, z, s], i) => (
        <mesh key={`b${i}`} position={[x, y, -z]} scale={s}>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color={PURPLE} flatShading roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function CheetaraHead3D({ progress }: { progress?: number }) {
  const scrollMode = progress !== undefined;

  return (
    <Canvas
      camera={{ position: [2.9, 0.55, 3.1], fov: 30 }}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-3, -1, -4]} intensity={0.5} color="#602088" />

      <Float
        speed={1.5}
        rotationIntensity={scrollMode ? 0.05 : 0.15}
        floatIntensity={scrollMode ? 0.15 : 0.4}
      >
        <JaguarHead progress={progress} />
      </Float>

      {!scrollMode && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.8}
        />
      )}
    </Canvas>
  );
}
