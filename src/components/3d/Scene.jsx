'use client';

import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import ParticleField from './ParticleField';
import HeroModel from './HeroModel';

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#A855F7" />
      <pointLight position={[10, 5, 5]} intensity={0.3} color="#00FFFF" />
      <fog attach="fog" args={['#030712', 15, 30]} />
    </>
  );
}

export default function Scene({ showHeroModel = true }) {
  return (
    <Canvas
      className="three-canvas"
      camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <SceneLights />
        <ParticleField count={1800} />
        {showHeroModel && <HeroModel />}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
