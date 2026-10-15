"use client";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

/* The bottle is the Blender model in /public/bottle.glb (source: blender/make_bottle.py). */
export default function Bottle({ scroll, mouse }: { scroll: React.MutableRefObject<number>; mouse: React.MutableRefObject<THREE.Vector2> }) {
  const group = useRef<THREE.Group>(null!);
  const { scene } = useGLTF("/bottle.glb");

  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat.metalness > 0.5) mat.envMapIntensity = 1.8;
        else mat.envMapIntensity = 1.2;
      }
    });
  }, [scene]);

  useFrame((state, dt) => {
    const s = scroll.current, g = group.current, t = state.clock.elapsedTime;
    const mobile = state.size.width < 800;
    const rotY = -0.45 + s * Math.PI * 2.6 + mouse.current.x * 0.7 + Math.sin(t * 0.4) * 0.05;
    const rotX = mouse.current.y * 0.18;
    const x = mobile ? 0 : 1.7 * Math.cos(s * Math.PI * 2);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, rotY, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rotX, 3, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, x, 2.5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, -1.35 + Math.sin(t * 0.8) * 0.03, 2.5, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, mobile ? 0.62 : 0.9, 3, dt));
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}
useGLTF.preload("/bottle.glb");
