'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField({ count = 2000 }) {
  const mesh = useRef();
  const light = useRef();
  const { mouse } = useThree();

  // Generate random particle positions and colors
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorA = new THREE.Color('#00FFFF'); // cyan
    const colorB = new THREE.Color('#A855F7'); // purple
    const colorC = new THREE.Color('#FFFFFF'); // white

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Spread particles across the scene
      positions[i3] = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;

      // Randomly assign colors
      const rand = Math.random();
      const color = rand < 0.5 ? colorA : rand < 0.8 ? colorB : colorC;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return [positions, colors];
  }, [count]);

  // Animate particles
  useFrame((state) => {
    const time = performance.now() * 0.001;

    if (mesh.current) {
      // Slow rotation
      mesh.current.rotation.x = time * 0.02;
      mesh.current.rotation.y = time * 0.015;

      // Mouse interaction — subtle drift
      mesh.current.rotation.y += mouse.x * 0.0008;
      mesh.current.rotation.x += mouse.y * 0.0008;

      // Subtle breathing/pulsing via scale
      const scale = 1 + Math.sin(time * 0.3) * 0.02;
      mesh.current.scale.setScalar(scale);
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
