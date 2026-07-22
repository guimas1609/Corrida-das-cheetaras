"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MARK_PATH, MARK_VIEWBOX } from "./cheetaraMarkPath";

const PINK = new THREE.Color("#f02090");
const PURPLE = new THREE.Color("#602088");

/**
 * Extrusão 3D da silhueta oficial do mark (cabeça da cheetah), com o
 * gradiente rosa→roxo da marca aplicado por vértice ao longo do eixo X.
 */
function useMarkGeometry() {
  return useMemo(() => {
    const svgText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"><path d="${MARK_PATH}" fill="black" fill-rule="evenodd"/></svg>`;
    const svgData = new SVGLoader().parse(svgText);
    const shapes = svgData.paths.flatMap((p) => SVGLoader.createShapes(p));

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 90,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 6,
      bevelSegments: 2,
      curveSegments: 6,
    });

    // SVG tem Y pra baixo — rotação em X corrige sem inverter o winding.
    geo.rotateX(Math.PI);
    geo.center();

    geo.computeBoundingBox();
    const size = new THREE.Vector3();
    geo.boundingBox!.getSize(size);
    const s = 2.4 / Math.max(size.x, size.y);
    geo.scale(s, s, s);

    geo.computeBoundingBox();
    const bbox = geo.boundingBox!;
    const pos = geo.attributes.position;
    const colors: number[] = [];
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getX(i) - bbox.min.x) / (bbox.max.x - bbox.min.x);
      c.lerpColors(PINK, PURPLE, t);
      colors.push(c.r, c.g, c.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function CheetaraMark() {
  const group = useRef<THREE.Group>(null);
  const geometry = useMarkGeometry();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        {/* Reflexos um pouco mais fortes (metalness/envMapIntensity) pra
            ficar mais "premium" com o HDRI de estúdio, sem estourar o
            brilho (roughness ainda moderado). */}
        <meshStandardMaterial
          vertexColors
          roughness={0.32}
          metalness={0.25}
          envMapIntensity={1.15}
        />
      </mesh>
    </group>
  );
}

/**
 * Vitrine de vidro: uma caixa 3D real (não CSS) ao redor do mark, com
 * material de transmissão (vidro/frost) — fica parada enquanto o mark gira
 * dentro dela. `transmission` nativo do meshPhysicalMaterial usa o HDRI da
 * cena pro reflexo/refração, bem mais leve que uma cena cheia de reflector
 * + geometria extra (ver histórico: pódio em 3D anterior ficou pesado).
 */
function GlassCase() {
  return (
    <RoundedBox args={[3, 3, 1.4]} radius={0.3} smoothness={4}>
      <meshPhysicalMaterial
        transmission={0.9}
        roughness={0.22}
        thickness={0.8}
        ior={1.4}
        clearcoat={1}
        clearcoatRoughness={0.12}
        color="#ffffff"
        envMapIntensity={1.2}
      />
    </RoundedBox>
  );
}

/**
 * Sempre gira sozinha e sempre pode ser arrastada com o dedo/mouse —
 * totalmente independente de scroll ou de qualquer outro estado da página.
 * Usado no hero (mobile e desktop), sempre dentro da vitrine de vidro.
 */
export default function CheetaraHead3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 4.6], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Iluminação de estúdio: key branca suave (canto superior esquerdo),
          fill branca fraca do lado oposto (suaviza sombra), rim branca
          atrás (separa a silhueta do fundo). */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[-4, 5, 3]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[4, -1.5, 2]} intensity={0.3} color="#ffffff" />
      <directionalLight position={[0, 1.5, -5]} intensity={1.1} color="#ffffff" />
      {/* HDRI de estúdio pra reflexo natural nos materiais metálicos */}
      <Environment preset="studio" />

      <GlassCase />

      <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.18}>
        <CheetaraMark />
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
