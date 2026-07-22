"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Edges,
  Environment,
  OrbitControls,
  Float,
  RoundedBox,
} from "@react-three/drei";
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

  // Rotação extremamente lenta (volta completa em ~1min15s) — peça de
  // exposição, não brinquedo girando rápido.
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.32}
          metalness={0.25}
          envMapIntensity={0.9}
        />
      </mesh>
    </group>
  );
}

/**
 * Base de acrílico onde o mark "repousa" — sem ela a peça parece flutuar
 * sem referência nenhuma dentro da vitrine.
 */
function AcrylicBase() {
  return (
    <mesh position={[0, -0.68, 0]}>
      <cylinderGeometry args={[0.48, 0.52, 0.1, 48]} />
      <meshPhysicalMaterial
        transmission={0.5}
        roughness={0.12}
        thickness={0.3}
        ior={1.45}
        clearcoat={0.7}
        clearcoatRoughness={0.08}
        color="#f5f0f6"
        envMapIntensity={0.8}
      />
    </mesh>
  );
}

/**
 * Vitrine de vidro: uma caixa 3D real (não CSS) ao redor do mark. Vidro
 * quase invisível (transmission alto, roughness bem baixo — nada de
 * frost/embaçado, que é o que fazia parecer um bloco branco sólido antes),
 * com uma borda fininha (`Edges`, 1px real de linha) marcando o volume.
 * `transmission` nativo do meshPhysicalMaterial já refrata a foto de fundo
 * usando o HDRI da cena, sem precisar de reflector/geometria extra pesada
 * (ver histórico: pódio em 3D anterior ficou pesado).
 */
function GlassCase() {
  return (
    <RoundedBox args={[2.4, 2.4, 1.1]} radius={0.24} smoothness={4}>
      <meshPhysicalMaterial
        transmission={0.96}
        roughness={0.045}
        thickness={0.22}
        ior={1.5}
        clearcoat={0.5}
        clearcoatRoughness={0.06}
        color="#ffffff"
        envMapIntensity={0.7}
      />
      {/* Borda fina e levemente iluminada (linewidth do WebGL já satura em
          ~1px na maioria dos navegadores — exatamente o efeito pedido) */}
      <Edges color="#ffffff" transparent opacity={0.35} />
    </RoundedBox>
  );
}

/**
 * Sempre pode ser arrastada com o dedo/mouse — totalmente independente de
 * scroll ou de qualquer outro estado da página. Usado no hero (mobile e
 * desktop), sempre dentro da vitrine de vidro.
 */
export default function CheetaraHead3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 4.6], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Iluminação de estúdio: key branca suave (esquerda), fill branca
          fraca do lado oposto (suaviza sombra), rim branca atrás (separa a
          silhueta do mark do fundo). Ambient baixo pra manter o mark como
          elemento mais iluminado da cena. */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[-4, 2.5, 3]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[4, -1, 2]} intensity={0.22} color="#ffffff" />
      <directionalLight position={[0, 1.5, -5]} intensity={1.1} color="#ffffff" />
      {/* HDRI de estúdio pra reflexo natural nos materiais metálicos/vidro */}
      <Environment preset="studio" />

      <GlassCase />
      <AcrylicBase />

      {/* Flutuação bem sutil (poucos px de amplitude) — a vitrine em volta
          fica parada, só a peça dentro se move devagar. */}
      <Float speed={1.2} rotationIntensity={0.015} floatIntensity={0.05}>
        <CheetaraMark />
      </Float>

      {/* Sombra de contato na base, embaixo da peça — dá a noção de peso e
          profundidade (aproximação leve de AO, sem post-processing). */}
      <ContactShadows
        position={[0, -0.72, 0]}
        opacity={0.45}
        scale={1.6}
        blur={2}
        far={1}
        resolution={256}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
