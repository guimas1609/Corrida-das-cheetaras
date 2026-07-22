"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
        clearcoat={0.5}
        clearcoatRoughness={0.1}
        color="#f5f0f6"
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

/**
 * A foto da corrida renderizada dentro da própria cena 3D, bem atrás de
 * tudo. Sem isso, o `transmission` do vidro não tem o que refratar (ele
 * refrata o que está atrás DENTRO da cena Three.js, não o <img> do DOM por
 * trás do canvas) — e cai pra reflexo do HDRI, que é claro/branco. É esse
 * bug que fazia a vitrine parecer um bloco branco sólido.
 */
function SceneBackdrop({ src }: { src: string }) {
  // TextureLoader "cru" (não o useTexture do drei) de propósito: assim dá
  // pra ajustar o colorSpace na própria construção do objeto, sem mutar
  // depois um valor devolvido por hook (o linter do React barra isso). Não
  // suspende — a textura só troca de blank pra imagem quando carrega, sem
  // travar a cena.
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(src);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [src]);
  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[12, 12]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/**
 * Vitrine de vidro: uma caixa 3D real (não CSS) ao redor do mark. Vidro
 * quase invisível (transmission bem alto, roughness bem baixo, pouco
 * clearcoat/envMapIntensity) — sem branco sólido, sem glow preenchendo a
 * superfície. Existe principalmente pela borda fina (`Edges`) e por
 * highlights pequenos nos cantos, não por brilho espalhado.
 */
function GlassCase() {
  return (
    <RoundedBox args={[2.4, 2.4, 1.1]} radius={0.24} smoothness={4}>
      <meshPhysicalMaterial
        transmission={0.97}
        roughness={0.035}
        thickness={0.35}
        ior={1.45}
        clearcoat={0.3}
        clearcoatRoughness={0.1}
        color="#ffffff"
        envMapIntensity={0.35}
      />
      {/* Borda fina e discreta (linewidth do WebGL já satura em ~1px na
          maioria dos navegadores) — é por ela que o vidro "existe". */}
      <Edges color="#ffffff" transparent opacity={0.45} />
    </RoundedBox>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

/**
 * Sempre pode ser arrastada com o dedo/mouse — totalmente independente de
 * scroll ou de qualquer outro estado da página. Usado no hero (mobile e
 * desktop), sempre dentro da vitrine de vidro. `mobileBackground`/
 * `desktopBackground`: a mesma foto que já aparece no DOM ao redor do
 * canvas, carregada de novo como textura só pra refração ficar coerente
 * com o que se vê fora da vitrine.
 */
export default function CheetaraHead3D({
  mobileBackground,
  desktopBackground,
}: {
  mobileBackground: string;
  desktopBackground: string;
}) {
  const isDesktop = useIsDesktop();

  return (
    <Canvas
      camera={{ position: [0, 0.15, 4.6], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Iluminação de estúdio: key branca suave (esquerda), fill branca
          fraca do lado oposto (suaviza sombra), rim branca atrás (separa a
          silhueta do mark do fundo). Ambient baixo pra manter o mark como
          elemento mais iluminado da cena — o vidro não é "iluminado", só
          reflete. */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[-4, 2.5, 3]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[4, -1, 2]} intensity={0.2} color="#ffffff" />
      <directionalLight position={[0, 1.5, -5]} intensity={1.1} color="#ffffff" />
      {/* HDRI de estúdio pra reflexo natural nos materiais metálicos/vidro */}
      <Environment preset="studio" />

      <SceneBackdrop src={isDesktop ? desktopBackground : mobileBackground} />

      {/* Leve giro estático (não anima) só pra mostrar a lateral e os
          cantos lapidados da caixa — sem isso a câmera vê só a face frontal
          lisa e a espessura do vidro nunca aparece. */}
      <group rotation={[0.05, 0.26, 0]}>
        <GlassCase />
        <AcrylicBase />

        {/* Flutuação bem sutil (poucos px de amplitude) — a vitrine em
            volta fica parada, só a peça dentro se move devagar. */}
        <Float speed={1.2} rotationIntensity={0.015} floatIntensity={0.05}>
          <CheetaraMark />
        </Float>

        {/* Sombra de contato na base — dá noção de peso/profundidade
            (aproximação leve de AO, sem post-processing). */}
        <ContactShadows
          position={[0, -0.72, 0]}
          opacity={0.45}
          scale={1.6}
          blur={2}
          far={1}
          resolution={256}
        />
      </group>

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
