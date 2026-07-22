"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  MeshReflectorMaterial,
  OrbitControls,
  Text,
} from "@react-three/drei";
import { CheetaraMark } from "./CheetaraHead3D";

/**
 * Pódio (2º/1º/3º lugar) em cilindros reais na mesma cena 3D do mark —
 * substitui a foto de fundo antiga. Como tudo compartilha a mesma câmera,
 * o mark sempre fica exatamente em pé sobre o bloco do 1º lugar em
 * qualquer resolução (sem o problema de recorte de `object-cover`).
 */
const PEDESTALS = [
  { place: "2", x: -2, height: 1.3 },
  { place: "1", x: 0, height: 1.9 },
  { place: "3", x: 2, height: 1.0 },
] as const;

const PEDESTAL_RADIUS = 0.95;
const FIRST_PLACE_HEIGHT = 1.9;
const MARK_STAND_HEIGHT = 1.1; // metade da altura aproximada do mark, pra "pousar" no topo do bloco 1

function Pedestal({ x, height, place }: (typeof PEDESTALS)[number]) {
  return (
    <group position={[x, height / 2, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[PEDESTAL_RADIUS, PEDESTAL_RADIUS, height, 48]} />
        <meshPhysicalMaterial
          color="#fbf7f9"
          roughness={0.25}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>
      <Text
        position={[0, height * 0.15, PEDESTAL_RADIUS + 0.02]}
        fontSize={height * 0.35}
        color="#f7eef3"
        anchorX="center"
        anchorY="middle"
      >
        {place}
      </Text>
    </group>
  );
}

function Podium() {
  return (
    <>
      {PEDESTALS.map((p) => (
        <Pedestal key={p.place} {...p} />
      ))}

      <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.18}>
        <group position={[0, FIRST_PLACE_HEIGHT + MARK_STAND_HEIGHT, 0]}>
          <CheetaraMark />
        </group>
      </Float>

      <ContactShadows
        position={[0, FIRST_PLACE_HEIGHT + 0.01, 0]}
        opacity={0.55}
        scale={2.4}
        blur={2.2}
        far={2}
      />

      {/* Piso espelhado, estilo estúdio */}
      <mesh rotation-x={-Math.PI / 2} position-y={0}>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#f7f1f4"
          metalness={0.5}
        />
      </mesh>
    </>
  );
}

/**
 * Canvas maior, só desktop — arrastar orbita a câmera ao redor do pódio +
 * mark juntos (o mark, além disso, também gira sozinho no próprio eixo).
 */
export default function HeroPodiumScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.4, 7.5], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <hemisphereLight args={["#ffffff", "#f0e6ec", 0.7]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 5]} intensity={1.4} castShadow />
      <directionalLight position={[0, 3, 6]} intensity={0.5} />
      <directionalLight position={[-4, 1, -3]} intensity={0.4} color="#602088" />
      <directionalLight position={[4, -1, 2]} intensity={0.35} color="#f02090" />

      <Podium />

      <OrbitControls
        target={[0, 1.4, 0]}
        enableZoom={false}
        enablePan={false}
        enableDamping
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.15}
      />
    </Canvas>
  );
}
