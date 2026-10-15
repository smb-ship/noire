"use client";
import * as THREE from "three";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, ContactShadows } from "@react-three/drei";
import Bottle from "./Bottle";
import Smoke from "./Smoke";

function Rig({ scroll, mouse }: { scroll: React.MutableRefObject<number>; mouse: React.MutableRefObject<THREE.Vector2> }) {
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    const onMove = (e: PointerEvent) => {
      mouse.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("pointermove", onMove); };
  }, [scroll, mouse]);

  useFrame((state, dt) => {
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, mouse.current.x * 0.3, 2, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, -mouse.current.y * 0.2, 2, dt);
    state.camera.lookAt(0, 0.4, 0);
  });
  return null;
}

export default function Scene({ onReady }: { onReady?: () => void }) {
  const scroll = useRef(0);
  const mouse = useRef(new THREE.Vector2());
  return (
    <Canvas
      camera={{ position: [0, 0.3, 7.2], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      onCreated={() => onReady?.()}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      <color attach="background" args={["#060504"]} />
      <fog attach="fog" args={["#050505", 8, 16]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[4, 5, 4]} angle={0.4} penumbra={1} intensity={60} color="#ffe2b0" />
      <spotLight position={[-5, 2, -3]} angle={0.5} penumbra={1} intensity={40} color="#8aa0ff" />
      <pointLight position={[0, -2, 3]} intensity={6} color="#d9bf8c" />
      <Suspense fallback={null}>
        {/* offline studio lighting: no HDR download needed */}
        <Environment resolution={512}>
          <Lightformer form="rect" intensity={4} position={[0, 4, -4]} scale={[10, 2, 1]} color="#fff2d6" />
          <Lightformer form="rect" intensity={3} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={2} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#d9bf8c" />
          <Lightformer form="ring" intensity={2} position={[0, 0, 5]} scale={4} color="#ffffff" />
        </Environment>
        <Bottle scroll={scroll} mouse={mouse} />
        <Smoke />
        <Sparkles count={50} scale={[7, 5, 4]} size={2.2} speed={0.25} color="#e9d3a2" opacity={0.7} />
        <ContactShadows position={[0, -1.35, 0]} opacity={0.7} scale={8} blur={2.8} far={3} color="#000" />
      </Suspense>
      <Rig scroll={scroll} mouse={mouse} />
    </Canvas>
  );
}
