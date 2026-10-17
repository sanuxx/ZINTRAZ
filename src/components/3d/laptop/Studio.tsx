"use client";

import { Suspense, useEffect, useMemo } from "react";
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { CanvasTexture } from "three";
import { DEVICE3D } from "@/lib/device3d";

/**
 * The photo studio around the device (units: cm, floor at y = FLOOR_Y):
 * - Environment: the CC0 studio HDRI (DEVICE3D.envMap) baked together with Lightformers into one HDR
 *   cube map: an overhead softbox, cool strip lights either side for long edge highlights on the
 *   aluminium, a broad sweep behind (the clean gradient the deck reflects) and a warm low kicker.
 * - Direct light: soft key from above-front-left, restrained fill from the right, cool rim from behind.
 * - Set: a seamless backdrop (lit pool fading into the floor colour), a floor that is glossy and
 *   reflective at high quality and matte at low quality, and soft contact shadows under the device.
 */
export const FLOOR_Y = -1.08;
const STAGE = DEVICE3D.stage;

function Backdrop() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(256, 210, 8, 256, 250, 280);
    r.addColorStop(0, "#2b3753");
    r.addColorStop(0.5, "#151c2c");
    r.addColorStop(1, STAGE);
    g.fillStyle = r;
    g.fillRect(0, 0, 512, 512);
    // Blend into the floor colour around the floor line, so the set reads as one seamless sweep.
    const v = g.createLinearGradient(0, 300, 0, 400);
    v.addColorStop(0, "rgba(11,14,21,0)");
    v.addColorStop(1, STAGE);
    g.fillStyle = v;
    g.fillRect(0, 300, 512, 212);
    return new CanvasTexture(c);
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[0, 18, -60]}>
      <planeGeometry args={[260, 150]} />
      <meshBasicMaterial map={tex} toneMapped={false} fog={false} />
    </mesh>
  );
}

export default function Studio({ quality }: { quality: "high" | "low" }) {
  return (
    <>
      <color attach="background" args={[STAGE]} />
      <fog attach="fog" args={[STAGE, 70, 170]} />
      <Backdrop />
      <ambientLight intensity={0.18} />
      {/* Key: broad and soft, above front-left */}
      <spotLight position={[-30, 46, 40]} angle={0.5} penumbra={1} intensity={5200} decay={2} color="#f6f8ff" />
      {/* Fill: restrained, from the right */}
      <directionalLight position={[34, 12, 20]} intensity={0.35} color="#e6ecff" />
      {/* Rim: cool, from behind, to separate the lid's silhouette from the set */}
      <spotLight position={[6, 30, -48]} angle={0.55} penumbra={1} intensity={3600} decay={2} color="#9db8ff" />
      <Suspense fallback={null}>
        <Environment files={DEVICE3D.envMap} resolution={512} environmentIntensity={DEVICE3D.envIntensity}>
          <Lightformer form="rect" intensity={2.2} position={[0, 34, 10]} rotation-x={Math.PI / 2} scale={[50, 18, 1]} />
          <Lightformer form="rect" intensity={3.2} color="#dde7ff" position={[-38, 10, 6]} rotation-y={Math.PI / 2} scale={[40, 3, 1]} />
          <Lightformer form="rect" intensity={3.2} color="#dde7ff" position={[38, 10, 6]} rotation-y={-Math.PI / 2} scale={[40, 3, 1]} />
          <Lightformer form="rect" intensity={2.6} position={[0, 12, -42]} scale={[110, 30, 1]} />
          <Lightformer form="rect" intensity={0.9} color="#ffdcb8" position={[28, -2, 30]} rotation-y={-Math.PI / 4} scale={[18, 8, 1]} />
        </Environment>
      </Suspense>
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, 0]}>
        <planeGeometry args={[400, 400]} />
        {quality === "high" ? (
          <MeshReflectorMaterial blur={[500, 140]} resolution={1024} mixBlur={1} mixStrength={18} roughness={1} depthScale={1}
            minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#0c0f17" metalness={0.5} mirror={0.5} />
        ) : (
          <meshStandardMaterial color="#0c0f17" roughness={0.85} />
        )}
      </mesh>
      <ContactShadows position={[0, FLOOR_Y + 0.02, 0]} opacity={0.75} scale={80} blur={2.4} far={12} resolution={1024} color="#000000" />
    </>
  );
}
