"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MARK_PATH, MARK_VIEWBOX } from "./cheetaraMarkPath";

const PINK = new THREE.Color("#f02090");
const PURPLE = new THREE.Color("#602088");
const HALO_PURPLE = "194, 24, 255"; // #C218FF em rgb, pro radial gradient da textura

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

  // Rotação extremamente lenta — uma volta completa a cada ~45s.
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * ((Math.PI * 2) / 45);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        {/* Mais reflexo/contraste sem aumentar o brilho geral: roughness
            um pouco mais baixo (reflexos mais nítidos), metalness um
            pouco mais alto — aparência sólida, não brilhante. */}
        <meshStandardMaterial
          vertexColors
          roughness={0.28}
          metalness={0.3}
          envMapIntensity={0.85}
        />
      </mesh>
    </group>
  );
}

/**
 * Halo de luz atrás da logo: um plano com gradiente radial roxo bem suave
 * (textura gerada em canvas), em additive blending — light-looking, não
 * "glow de div CSS". Fica fora do TiltRig: é ambiente, não gira com a peça.
 */
function useHaloTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, `rgba(${HALO_PURPLE}, 0.5)`);
    gradient.addColorStop(0.35, `rgba(${HALO_PURPLE}, 0.22)`);
    gradient.addColorStop(0.7, `rgba(${HALO_PURPLE}, 0.06)`);
    gradient.addColorStop(1, `rgba(${HALO_PURPLE}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function Halo() {
  const texture = useHaloTexture();
  return (
    <mesh position={[0, 0.1, -1.4]}>
      <planeGeometry args={[4.4, 4.4]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * Dados da poeira luminosa gerados uma única vez, fora do render (o linter
 * do React proíbe `Math.random` dentro de componente/hook) — branco e
 * roxo, algumas mais próximas da câmera (leem como "em foco"), outras mais
 * afastadas ("desfocadas"). Poucas partículas, pequenas, opacidade baixa
 * — nunca deve parecer neve.
 */
const PARTICLE_COUNT = 34;
const PARTICLES = (() => {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const white = new THREE.Color("#ffffff");
  const purple = new THREE.Color("#C218FF");
  const tmp = new THREE.Color();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = 1.3 + Math.random() * 1.7;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 2.4;
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius * 0.6 - 0.4;
    tmp.copy(Math.random() > 0.55 ? white : purple);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  return { positions, colors };
})();

function Particles() {
  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[PARTICLES.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[PARTICLES.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Segue o ponteiro na janela inteira (não só dentro do canvas). */
function useGlobalPointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

/**
 * Inclina a logo levemente em direção ao cursor (até 6°), com easing —
 * substitui o antigo "arrastar pra orbitar": aqui a peça reage sozinha ao
 * mouse, sem precisar de clique/arrasto, como uma vitrine de produto.
 */
function TiltRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useGlobalPointer();
  const maxTilt = THREE.MathUtils.degToRad(6);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetX = -pointer.current.y * maxTilt;
    const targetY = pointer.current.x * maxTilt;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
  });

  return <group ref={group}>{children}</group>;
}

/**
 * A logo 3D como peça central do hero: nenhuma caixa/container ao redor —
 * só ela, um halo de luz suave, uma sombra de contato quase imperceptível
 * embaixo, e poeira luminosa discreta no fundo. Sofisticação vem de luz,
 * profundidade e composição, não de um efeito de vidro.
 */
export default function CheetaraHead3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 5.2], fov: 38 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
    >
      {/* Iluminação de estúdio/palco: key branca suave da esquerda, fill
          fraca e levemente fria do lado oposto (começo de color grading
          "sombras frias"), rim branca forte atrás (destaca a silhueta),
          spot roxo bem fraco atrás simulando o refletor do halo. */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[-4, 3, 3]} intensity={1.3} color="#ffffff" />
      <directionalLight position={[4, -1, 2]} intensity={0.16} color="#a9c2ff" />
      <directionalLight position={[0, 1.2, -5]} intensity={1.4} color="#ffffff" />
      <spotLight
        position={[0, 1, -4]}
        angle={0.55}
        penumbra={1}
        intensity={0.5}
        color="#c218ff"
        distance={9}
        decay={2}
      />
      <Environment preset="studio" />

      <Halo />
      <Particles />

      <TiltRig>
        {/* Flutuação de poucos pixels de amplitude — nunca mecânica */}
        <Float speed={1.1} rotationIntensity={0.01} floatIntensity={0.045}>
          <CheetaraMark />
        </Float>
      </TiltRig>

      {/* Sombra quase imperceptível — só o suficiente pra não parecer
          "colada" na tela, sem post-processing/AO pesado. */}
      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.22}
        scale={2.6}
        blur={2.8}
        far={1.4}
        resolution={256}
        color="#1a0a24"
      />
    </Canvas>
  );
}
