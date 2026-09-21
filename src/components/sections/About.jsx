'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCMS } from '@/context/CMSContext';
import styles from './About.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function About() {
  const { cmsData } = useCMS();
  const info = cmsData?.personalInfo || {};
  const aboutData = cmsData?.about || {};

  const avatarShape = aboutData.avatarShape || 'morphing-bubble';
  const avatarAnim = aboutData.avatarAnimation || (avatarShape === 'morphing-bubble' ? 'morph' : 'pulse-glow');
  const showOrbitRings = aboutData.showOrbitRings ?? true;
  const showCornerBrackets = aboutData.showCornerBrackets ?? true;
  const avatarImgSrc = aboutData.avatarImage || '/profile.jpg';

  // Determine avatar CSS shape class
  const shapeClass =
    avatarShape === 'teardrop'
      ? styles.shapeTeardrop
      : avatarShape === 'modern-circle'
      ? styles.shapeCircle
      : avatarShape === 'rounded-squircle'
      ? styles.shapeSquircle
      : avatarShape === 'smooth-card'
      ? styles.shapeSmoothCard
      : avatarShape === 'cyber-hexagon'
      ? styles.shapeHexagon
      : avatarShape === 'cyber-octagon'
      ? styles.shapeOctagon
      : avatarShape === 'diamond-shield'
      ? styles.shapeDiamondShield
      : avatarShape === 'cyber-box'
      ? styles.shapeCyberBox
      : styles.shapeMorphBubble;

  // Determine avatar CSS animation class
  const animClass =
    avatarAnim === 'lava-lamp'
      ? styles.animLavaLamp
      : avatarAnim === 'jelly-bounce'
      ? styles.animJellyBounce
      : avatarAnim === 'cyber-glitch'
      ? styles.animCyberGlitch
      : avatarAnim === 'laser-scanner'
      ? styles.animLaserScanner
      : avatarAnim === 'neon-pulsar'
      ? styles.animNeonPulsar
      : avatarAnim === 'zero-g-float'
      ? styles.animZeroGFloat
      : avatarAnim === 'event-horizon'
      ? styles.animEventHorizon
      : avatarAnim === 'quantum-orbit'
      ? styles.animQuantumOrbit
      : avatarAnim === 'rotating-conic'
      ? styles.animRotatingConic
      : avatarAnim === 'pulse-glow'
      ? styles.animPulseGlow
      : avatarAnim === 'pure-static'
      ? styles.animPureStatic
      : avatarShape === 'morphing-bubble'
      ? styles.animMorph
      : styles.animPulseGlow;

  const dynamicStats = [
    { value: aboutData.yearsExperience || '4+', label: 'Years Experience' },
    { value: aboutData.projectsCompleted || '25+', label: 'Projects Delivered' },
    { value: aboutData.happyClients || '18+', label: 'Happy Clients' },
    { value: '∞', label: 'Cups of Coffee' },
  ];

  return (
    <section id="about" className={`section ${styles.about}`}>
      {/* Background orbs */}
      <div className={`orb orb-purple ${styles.orb1}`} style={{ width: 300, height: 300 }} />
      <div className={`orb orb-cyan ${styles.orb2}`} style={{ width: 200, height: 200 }} />

      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">{(!aboutData?.label || aboutData.label.includes('<//')) ? 'Who I Am' : aboutData.label}</p>
          <h2 className="section-title">{aboutData.title || 'About Me'}</h2>
          <p className="section-subtitle">
            {aboutData.subtitle || 'A glimpse into who I am, what drives me, and the journey that shaped my craft.'}
          </p>
        </motion.div>

        <div className={styles.grid}>
          {/* Left: Profile Visual */}
          <motion.div
            className={styles.visual}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.avatarFrame}>
              <div className={`${styles.avatarContainer} ${animClass}`}>
                <div className={`${styles.avatarInner} ${shapeClass}`}>
                  <Image 
                    src={avatarImgSrc} 
                    alt={info.name || 'John Liton Mardy'} 
                    fill
                    className={styles.avatarImage}
                    sizes="(max-width: 480px) 220px, 280px"
                    priority
                  />
                </div>
              </div>

              {/* Orbiting decorations */}
              {showOrbitRings && (
                <>
                  <div className={`${styles.orbit} ${styles.orbit1}`} />
                  <div className={`${styles.orbit} ${styles.orbit2}`} />
                </>
              )}

              {/* Corner brackets */}
              {showCornerBrackets && (
                <>
                  <div className={styles.bracketTL} />
                  <div className={styles.bracketBR} />
                </>
              )}
            </div>

            {/* Location badge */}
            {(aboutData.showLocationBadge ?? true) && (
              <div className={styles.locationBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {info.location || aboutData.location || 'Dhaka, Bangladesh'}
              </div>
            )}
          </motion.div>

          {/* Right: Text Content */}
          <div className={styles.textContent}>
            <motion.h3
              className={styles.subheading}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Hi, I&apos;m {info.name ? info.name.split(' ')[0] : 'John'} — I build things for the web &amp; mobile.
            </motion.h3>

            <motion.p
              className={styles.bio}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {info.bio}
            </motion.p>

            {aboutData.secondaryBio && (
              <motion.p
                className={styles.bio}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {aboutData.secondaryBio}
              </motion.p>
            )}

            {/* What I do list */}
            {(Array.isArray(aboutData.whatIDo) && aboutData.whatIDo.length > 0 ? aboutData.whatIDo : [
              'Build scalable full-stack web & mobile apps',
              'Create immersive 3D web experiences',
              'Architect clean, maintainable codebases',
              'Optimize for performance & accessibility',
            ]).length > 0 && (
              <motion.ul
                className={styles.doList}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {(Array.isArray(aboutData.whatIDo) && aboutData.whatIDo.length > 0 ? aboutData.whatIDo : [
                  'Build scalable full-stack web & mobile apps',
                  'Create immersive 3D web experiences',
                  'Architect clean, maintainable codebases',
                  'Optimize for performance & accessibility',
                ]).map((item, i) => (
                  <li key={i} className={styles.doItem}>
                    <span className={styles.doIcon}>▹</span>
                    {item}
                  </li>
                ))}
              </motion.ul>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a
                href={info.socialLinks?.find(s => s.platform === 'linkedin')?.url || info.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Connect on LinkedIn
              </a>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {dynamicStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`glass-card ${styles.statCard}`}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
