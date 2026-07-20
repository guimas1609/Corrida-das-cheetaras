"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MARK_PATH, MARK_VIEWBOX } from "./cheetaraMarkPath";

const PINK = new THREE.Color("#f02090");
const PURPLE = new THREE.Color("#602088");

// Pose final de frente pra câmera (câmera fica em x=0), começando de quase perfil.
const SCROLL_ROTATION_START = -Math.PI * 0.85;
const SCROLL_ROTATION_END = 0;

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

function CheetaraMark({ progress }: { progress?: number }) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMarkGeometry();

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
      rotation={[0, progress !== undefined ? SCROLL_ROTATION_START : 0, 0]}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.32}
          metalness={0.25}
        />
      </mesh>
    </group>
  );
}

export default function CheetaraHead3D({ progress }: { progress?: number }) {
  const scrollMode = progress !== undefined;

  return (
    <Canvas
      camera={{ position: [0, 0.15, 3.6], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <directionalLight position={[-4, -1, -3]} intensity={0.6} color="#602088" />
      <directionalLight position={[0, -3, 2]} intensity={0.3} color="#f02090" />

      <Float
        speed={1.5}
        rotationIntensity={scrollMode ? 0.05 : 0.1}
        floatIntensity={scrollMode ? 0.15 : 0.35}
      >
        <CheetaraMark progress={progress} />
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
