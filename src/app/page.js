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
    scanlines: true,
    showGrid: true,
    cursorGlow: true,
  };

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

      {/* Fixed 3D Canvas — renders behind all content */}
      <Scene showHeroModel={false} />

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
