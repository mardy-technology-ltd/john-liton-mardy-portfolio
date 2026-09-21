'use client';

import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import ParticleField from './ParticleField';
import HeroModel from './HeroModel';

function SceneLights({ primary = '#00ffff', secondary = '#a855f7', bgPrimary = '#030712' }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color={secondary} />
      <pointLight position={[10, 5, 5]} intensity={0.4} color={primary} />
      <fog attach="fog" args={[bgPrimary || '#030712', 15, 35]} />
    </>
  );
}

export default function Scene({
  bgAnimation = 'particles',
  animationSpeed = 1,
  particleCount = 1800,
  mouseReactivity = true,
  primaryColor = '#00ffff',
  secondaryColor = '#a855f7',
  accentColor = '#ffffff',
  bgPrimary = '#030712',
}) {
  const showHeroModel = bgAnimation === 'cyber-core';

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
        <SceneLights
          primary={primaryColor}
          secondary={secondaryColor}
          bgPrimary={bgPrimary}
        />

        <ParticleField
          mode={bgAnimation}
          count={particleCount}
          speed={animationSpeed}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          mouseReactivity={mouseReactivity}
        />

        {showHeroModel && (
          <HeroModel
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
          />
        )}

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
