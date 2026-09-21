'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField({
  mode = 'particles', // particles | neural-network | git-graph | binary-stream | matrix-stream | circuit-board | cloud-mesh | deep-space | terminal-grid | aurora-waves | minimal-clean
  count = 1800,
  speed = 1,
  primaryColor = '#00ffff',
  secondaryColor = '#a855f7',
  accentColor = '#ffffff',
  mouseReactivity = true,
}) {
  const mesh = useRef();
  const linesRef = useRef();
  const { mouse } = useThree();

  const isNeuralOrGit = mode === 'neural-network' || mode === 'git-graph' || mode === 'cloud-mesh';
  const nodeCount = isNeuralOrGit ? Math.min(count, 120) : (mode === 'minimal-clean' ? 200 : count);

  // Generate particle positions, velocities, colors and graph lines
  const { positions, colors, velocities, linePositions, lineColors } = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const col = new Float32Array(nodeCount * 3);
    const vel = new Float32Array(nodeCount * 3);

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

    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;

      if (mode === 'deep-space') {
        // Starfield cylinder/tunnel
        pos[i3] = (Math.random() - 0.5) * 30;
        pos[i3 + 1] = (Math.random() - 0.5) * 30;
        pos[i3 + 2] = (Math.random() - 0.5) * 40;
        vel[i3 + 2] = 0.08 + Math.random() * 0.15;
      } else if (mode === 'matrix-stream' || mode === 'binary-stream') {
        // Vertical data columns
        const colSpread = mode === 'binary-stream' ? 36 : 32;
        pos[i3] = (Math.random() - 0.5) * colSpread;
        pos[i3 + 1] = (Math.random() - 0.5) * 32;
        pos[i3 + 2] = (Math.random() - 0.5) * 15;
        vel[i3 + 1] = (mode === 'binary-stream' ? 0.08 : 0.05) + Math.random() * 0.12;
      } else if (mode === 'circuit-board') {
        // Orthogonal right-angle logic grid
        const step = 2.5;
        pos[i3] = Math.round((Math.random() - 0.5) * 12) * step;
        pos[i3 + 1] = Math.round((Math.random() - 0.5) * 12) * step;
        pos[i3 + 2] = (Math.random() - 0.5) * 8;
        vel[i3] = (Math.random() > 0.5 ? 1 : -1) * 0.04;
      } else if (mode === 'git-graph') {
        // Git branch lanes
        const lane = (i % 4 - 1.5) * 3;
        pos[i3] = lane + (Math.random() - 0.5) * 0.6;
        pos[i3 + 1] = (i / nodeCount - 0.5) * 24;
        pos[i3 + 2] = (Math.random() - 0.5) * 6;
      } else if (mode === 'cloud-mesh') {
        // Spherical microservice clusters
        const cluster = i % 5;
        const cx = Math.cos(cluster * 1.25) * 6;
        const cy = Math.sin(cluster * 1.25) * 6;
        pos[i3] = cx + (Math.random() - 0.5) * 4;
        pos[i3 + 1] = cy + (Math.random() - 0.5) * 4;
        pos[i3 + 2] = (Math.random() - 0.5) * 8;
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

    // Build neural / git connecting lines
    const linePos = [];
    const lineCol = [];

    if (isNeuralOrGit) {
      const maxDistance = mode === 'git-graph' ? 4.5 : 5.0;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            linePos.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
            linePos.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);

            lineCol.push(col[i * 3], col[i * 3 + 1], col[i * 3 + 2]);
            lineCol.push(col[j * 3], col[j * 3 + 1], col[j * 3 + 2]);
          }
        }
      }
    }

    return {
      positions: pos,
      colors: col,
      velocities: vel,
      linePositions: new Float32Array(linePos),
      lineColors: new Float32Array(lineCol),
    };
  }, [nodeCount, mode, primaryColor, secondaryColor, accentColor, isNeuralOrGit]);

  // Animate based on active developer mode
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * (speed || 1);

    if (mesh.current) {
      const posAttr = mesh.current.geometry.attributes.position;
      const array = posAttr.array;

      if (mode === 'deep-space') {
        // Warp forward
        for (let i = 0; i < nodeCount; i++) {
          const zIndex = i * 3 + 2;
          array[zIndex] += velocities[zIndex] * (speed || 1) * 28 * delta;
          if (array[zIndex] > 10) array[zIndex] = -30;
        }
        posAttr.needsUpdate = true;

        if (mouseReactivity) {
          mesh.current.rotation.x = mouse.y * 0.1;
          mesh.current.rotation.y = mouse.x * 0.1;
        }
      } else if (mode === 'matrix-stream' || mode === 'binary-stream') {
        // Cascade down
        const fallMultiplier = mode === 'binary-stream' ? 22 : 16;
        for (let i = 0; i < nodeCount; i++) {
          const yIndex = i * 3 + 1;
          array[yIndex] -= velocities[yIndex] * (speed || 1) * fallMultiplier * delta;
          if (array[yIndex] < -16) array[yIndex] = 16;
        }
        posAttr.needsUpdate = true;
      } else if (mode === 'circuit-board') {
        // Circuit pulse jitter
        mesh.current.rotation.z = Math.sin(time * 0.2) * 0.05;
      } else if (isNeuralOrGit) {
        // Dynamic node floating & synaptic mesh rotation
        mesh.current.rotation.y = time * 0.03;
        mesh.current.rotation.x = Math.sin(time * 0.02) * 0.1;

        if (linesRef.current) {
          linesRef.current.rotation.y = mesh.current.rotation.y;
          linesRef.current.rotation.x = mesh.current.rotation.x;
        }

        if (mouseReactivity) {
          mesh.current.rotation.y += mouse.x * 0.001;
          mesh.current.rotation.x += mouse.y * 0.001;
          if (linesRef.current) {
            linesRef.current.rotation.y = mesh.current.rotation.y;
            linesRef.current.rotation.x = mesh.current.rotation.x;
          }
        }
      } else if (mode === 'minimal-clean') {
        mesh.current.rotation.y = time * 0.005;
      } else {
        // Classic particles & terminal grid
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

  const particleSize = isNeuralOrGit
    ? 0.12
    : mode === 'deep-space'
    ? 0.055
    : mode === 'matrix-stream' || mode === 'binary-stream'
    ? 0.048
    : 0.04;

  const particleOpacity = mode === 'minimal-clean' ? 0.3 : 0.85;

  return (
    <group>
      {/* Points */}
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

      {/* Interconnecting Synaptic / Git Graph Lines */}
      {isNeuralOrGit && linePositions.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
}
