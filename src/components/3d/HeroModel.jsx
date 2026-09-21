'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function GlowRing({ radius, tube, color, speed, rotX, rotZ }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed + rotX;
      ref.current.rotation.z = state.clock.elapsedTime * speed * 0.7 + rotZ;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.6}
        wireframe
      />
    </mesh>
  );
}

export default function HeroModel({
  primaryColor = '#00ffff',
  secondaryColor = '#a855f7',
  accentColor = '#ff6b9d',
}) {
  const coreRef = useRef();
  const outerRef = useRef();
  const groupRef = useRef();
  const { viewport } = useThree();
  
  // Detect mobile based on viewport width
  const isMobile = viewport.width < 5;
  const basePosition = isMobile ? [0, 0, -2] : [3.5, 0, 0];
  const baseScale = isMobile ? 0.7 : 1;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.3;
      coreRef.current.rotation.y = time * 0.5;
      coreRef.current.rotation.z = time * 0.2;
    }

    if (outerRef.current) {
      outerRef.current.rotation.x = -time * 0.15;
      outerRef.current.rotation.y = time * 0.25;
    }

    if (groupRef.current) {
      // Shrink and move up the model as user scrolls down
      const scroll = window.scrollY;
      // It will completely disappear after scrolling 400px down
      const newScale = Math.max(0, baseScale - scroll / 400); 
      groupRef.current.scale.setScalar(newScale);
      // Move slightly up
      groupRef.current.position.y = scroll * 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <group position={basePosition} ref={groupRef} scale={baseScale}>
        {/* Ambient lights for the model */}
        <pointLight color={primaryColor} intensity={2} distance={6} />
        <pointLight color={secondaryColor} intensity={1.5} distance={5} position={[2, 2, 2]} />

        {/* Core icosahedron */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.9, 1]} />
          <MeshDistortMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.4}
            distort={0.35}
            speed={2}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Inner glowing sphere */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={1.2}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Orbiting rings */}
        <GlowRing radius={1.6} tube={0.015} color={primaryColor} speed={0.4} rotX={0} rotZ={0} />
        <GlowRing radius={1.9} tube={0.01} color={secondaryColor} speed={0.25} rotX={Math.PI / 4} rotZ={Math.PI / 6} />
        <GlowRing radius={2.2} tube={0.008} color={accentColor} speed={0.15} rotX={Math.PI / 2} rotZ={Math.PI / 3} />

        {/* Outer wireframe sphere */}
        <mesh ref={outerRef}>
          <sphereGeometry args={[1.4, 12, 12]} />
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.3}
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Small orbiting satellites */}
        {[0, 1, 2].map((i) => (
          <OrbitingDot
            key={i}
            index={i}
            colors={[primaryColor, secondaryColor, accentColor]}
          />
        ))}
      </group>
    </Float>
  );
}

function OrbitingDot({ index, colors = ['#00FFFF', '#A855F7', '#FF6B9D'] }) {
  const ref = useRef();
  const speed = 0.6 + index * 0.3;
  const radius = 1.8 + index * 0.4;
  const yOffset = (index - 1) * 0.5;

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = yOffset + Math.sin(t * 2) * 0.3;
    }
  });

  const dotColor = colors[index % colors.length] || colors[0];

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial
        color={dotColor}
        emissive={dotColor}
        emissiveIntensity={3}
      />
    </mesh>
  );
}
