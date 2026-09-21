'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField({
  mode = 'particles', // particles | deep-space | matrix-stream | aurora-waves | minimal-clean
  count = 1800,
  speed = 1,
  primaryColor = '#00ffff',
  secondaryColor = '#a855f7',
  accentColor = '#ffffff',
  mouseReactivity = true,
}) {
  const mesh = useRef();
  const { mouse } = useThree();

  const adjustedCount = mode === 'minimal-clean' ? 200 : count;

  // Generate particle positions, velocities and colors
  const { positions, colors, velocities } = useMemo(() => {
    const pos = new Float32Array(adjustedCount * 3);
    const col = new Float32Array(adjustedCount * 3);
    const vel = new Float32Array(adjustedCount * 3);

    let colorA, colorB, colorC;
    try {
      colorA = new THREE.Color(primaryColor);
      colorB = new THREE.Color(secondaryColor);
      colorC = new THREE.Color(accentColor || '#ffffff');
    } catch {
      colorA = new THREE.Color('#00ffff');
      colorB = new THREE.Color('#a855f7');
      colorC = new THREE.Color('#ffffff');
    }

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3;

      if (mode === 'deep-space') {
        // Starfield cylinder/tunnel
        pos[i3] = (Math.random() - 0.5) * 30;
        pos[i3 + 1] = (Math.random() - 0.5) * 30;
        pos[i3 + 2] = (Math.random() - 0.5) * 40;
        vel[i3 + 2] = 0.08 + Math.random() * 0.15;
      } else if (mode === 'matrix-stream') {
        // Vertical data columns
        pos[i3] = (Math.random() - 0.5) * 32;
        pos[i3 + 1] = (Math.random() - 0.5) * 32;
        pos[i3 + 2] = (Math.random() - 0.5) * 15;
        vel[i3 + 1] = 0.05 + Math.random() * 0.1;
      } else {
        // Classic 3D constellation & particles
        pos[i3] = (Math.random() - 0.5) * 26;
        pos[i3 + 1] = (Math.random() - 0.5) * 26;
        pos[i3 + 2] = (Math.random() - 0.5) * 18;
      }

      // Assign color palette
      const rand = Math.random();
      const color = rand < 0.55 ? colorA : rand < 0.85 ? colorB : colorC;
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }

    return { positions: pos, colors: col, velocities: vel };
  }, [adjustedCount, mode, primaryColor, secondaryColor, accentColor]);

  // Animate particles based on active mode
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * (speed || 1);

    if (mesh.current) {
      const posAttr = mesh.current.geometry.attributes.position;
      const array = posAttr.array;

      if (mode === 'deep-space') {
        // Fly forward towards camera
        for (let i = 0; i < adjustedCount; i++) {
          const zIndex = i * 3 + 2;
          array[zIndex] += velocities[zIndex] * (speed || 1) * 25 * delta;
          if (array[zIndex] > 10) {
            array[zIndex] = -30;
          }
        }
        posAttr.needsUpdate = true;

        if (mouseReactivity) {
          mesh.current.rotation.x = mouse.y * 0.1;
          mesh.current.rotation.y = mouse.x * 0.1;
        }
      } else if (mode === 'matrix-stream') {
        // Cascade down
        for (let i = 0; i < adjustedCount; i++) {
          const yIndex = i * 3 + 1;
          array[yIndex] -= velocities[yIndex] * (speed || 1) * 15 * delta;
          if (array[yIndex] < -16) {
            array[yIndex] = 16;
          }
        }
        posAttr.needsUpdate = true;
      } else if (mode === 'minimal-clean') {
        // Very slow subtle idle
        mesh.current.rotation.y = time * 0.005;
      } else {
        // Classic particles & aurora waves
        mesh.current.rotation.x = time * 0.02;
        mesh.current.rotation.y = time * 0.015;

        if (mouseReactivity) {
          mesh.current.rotation.y += mouse.x * 0.0008;
          mesh.current.rotation.x += mouse.y * 0.0008;
        }

        const scale = 1 + Math.sin(time * 0.3) * 0.02;
        mesh.current.scale.setScalar(scale);
      }
    }
  });

  const particleSize = mode === 'deep-space' ? 0.055 : mode === 'matrix-stream' ? 0.045 : 0.04;
  const particleOpacity = mode === 'minimal-clean' ? 0.3 : 0.75;

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors
        transparent
        opacity={particleOpacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
