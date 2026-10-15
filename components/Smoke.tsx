"use client";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

/* Soft rising smoke made of additive sprites (no image files needed). */
function makeTex() {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const x = c.getContext("2d")!; const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,245,225,0.55)"); g.addColorStop(0.5, "rgba(255,235,205,0.16)"); g.addColorStop(1, "rgba(255,235,205,0)");
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}
export default function Smoke({ count = 28 }: { count?: number }) {
  const tex = useMemo(makeTex, []);
  const refs = useRef<THREE.Sprite[]>([]);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({ o: i / count, r: Math.random() * 6.28, s: 0.6 + Math.random() * 0.8 })), [count]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    seeds.forEach((p, i) => {
      const sp = refs.current[i]; if (!sp) return;
      const k = (t * 0.07 + p.o) % 1;
      sp.position.set(Math.sin(k * 7 + p.r) * (0.15 + k * 0.7), -0.4 + k * 4.2, Math.cos(k * 5 + p.r) * 0.3);
      const sc = (0.7 + k * 2.4) * p.s; sp.scale.set(sc, sc, 1);
      (sp.material as THREE.SpriteMaterial).opacity = Math.sin(k * Math.PI) * 0.5;
    });
  });
  return (
    <group position={[0.2, 0, -0.6]}>
      {seeds.map((_, i) => (
        <sprite key={i} ref={(r) => { if (r) refs.current[i] = r; }}>
          <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  );
}
