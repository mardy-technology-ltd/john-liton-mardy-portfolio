'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Blog from '@/components/sections/Blog';
import Contact from '@/components/sections/Contact';

import { useCMS } from '@/context/CMSContext';
import { themePresets } from '@/data/cmsData';

// Dynamically import the 3D Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import('@/components/3d/Scene'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const { cmsData } = useCMS();
  const cursorRef = useRef(null);

  const visibility = cmsData?.sectionVisibility || {
    hero: true,
    about: true,
    skills: true,
    projects: true,
    experience: true,
    blog: true,
    contact: true,
  };

  const themeConfig = cmsData?.themeConfig || {
    activeTheme: 'cyberpunk-neon',
    bgAnimation: 'particles',
    animationSpeed: 1,
    particleCount: 1800,
    mouseReactivity: true,
    scanlines: true,
    showGrid: true,
    cursorGlow: true,
  };

  const currentThemeId = themeConfig.activeTheme || 'cyberpunk-neon';
  const currentPreset = themePresets[currentThemeId] || themePresets['cyberpunk-neon'];
  const colors = themeConfig.customColors || currentPreset.colors;

  useEffect(() => {
    // Suppress harmless THREE.Clock deprecation warning from @react-three/fiber internals
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
      originalWarn.apply(console, args);
    };
    return () => { console.warn = originalWarn; };
  }, []);

  // Custom cursor glow that follows mouse
  useEffect(() => {
    if (!themeConfig.cursorGlow) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [themeConfig.cursorGlow]);

  return (
    <>
      {/* Scanline effect */}
      {themeConfig.scanlines && <div className="scanline" />}

      {/* Background grid */}
      {themeConfig.showGrid && <div className="bg-grid" />}

      {/* Cursor glow */}
      {themeConfig.cursorGlow && <div ref={cursorRef} className="cursor-glow" />}

      {/* Extra ambient glow if aurora-waves is chosen */}
      {themeConfig.bgAnimation === 'aurora-waves' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${colors.primary}20, transparent), radial-gradient(ellipse 60% 50% at 80% 80%, ${colors.secondary}15, transparent)`,
          }}
        />
      )}

      {/* Fixed 3D Canvas — renders behind all content */}
      <Scene
        bgAnimation={themeConfig.bgAnimation || 'particles'}
        animationSpeed={themeConfig.animationSpeed ?? 1}
        particleCount={themeConfig.particleCount ?? 1800}
        mouseReactivity={themeConfig.mouseReactivity ?? true}
        primaryColor={colors.primary}
        secondaryColor={colors.secondary}
        accentColor={colors.accentPink || colors.primary}
        bgPrimary={colors.bgPrimary}
      />

      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="page-content">
        {visibility.hero && <Hero />}
        {visibility.about && <About />}
        {visibility.skills && <Skills />}
        {visibility.projects && <Projects />}
        {visibility.experience && <Experience />}
        {visibility.blog && <Blog />}
        {visibility.contact && <Contact />}
      </main>
    </>
  );
}
