'use client';

import { motion } from 'framer-motion';
import TypeWriter from '@/components/ui/TypeWriter';
import SocialIcon from '@/components/ui/SocialIcon';
import HeroTerminal from '@/components/ui/HeroTerminal';
import { useCMS } from '@/context/CMSContext';
import styles from './Hero.module.css';

const typewriterTexts = [
  'Software Engineer',
  'Full Stack Developer',
  'Problem Solver',
  'Open Source Enthusiast',
  '3D Web Creator',
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Hero() {
  const { cmsData } = useCMS();
  const info = cmsData?.personalInfo || {};

  // Split name into first and last
  const nameParts = (info.name || 'John Liton Mardy').split(' ');
  const lastName = nameParts.length > 1 ? nameParts.pop() : '';
  const firstName = nameParts.join(' ');

  // Compute dynamic social links list
  const socialList = Array.isArray(info.socialLinks) && info.socialLinks.length > 0
    ? info.socialLinks
    : [
        ...(info.linkedin ? [{ id: 's-linkedin', platform: 'linkedin', label: 'LinkedIn', url: info.linkedin }] : []),
        ...(info.github ? [{ id: 's-github', platform: 'github', label: 'GitHub', url: info.github }] : []),
        ...(info.email ? [{ id: 's-email', platform: 'email', label: 'Email', url: info.email.startsWith('mailto:') ? info.email : `mailto:${info.email}` }] : []),
      ];

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.heroGrid}>
          {/* Left: Text & CTAs */}
          <motion.div
            className={styles.textBlock}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Status Badge */}
            {info.availableForWork && (
              <motion.div className={styles.statusBadge} variants={itemVariants}>
                <span className={styles.statusDot} />
                Available for work
              </motion.div>
            )}

            {/* Greeting */}
            <motion.p className={styles.greeting} variants={itemVariants}>
              Hello, World! I&apos;m
            </motion.p>

            {/* Name */}
            <motion.h1 id="hero-name" className={styles.name} variants={itemVariants}>
              <span className={styles.nameFirst}>{firstName}</span>
              {lastName && <span className={styles.nameLast}>{lastName}</span>}
            </motion.h1>

            {/* Typewriter Title */}
            <motion.div className={styles.titleRow} variants={itemVariants}>
              <span className={styles.titlePrefix}>&gt;&nbsp;</span>
              <TypeWriter texts={info.title ? [info.title, ...typewriterTexts.slice(1)] : typewriterTexts} speed={75} deleteSpeed={40} delay={2200} />
            </motion.div>

            {/* Bio */}
            <motion.p className={styles.bio} variants={itemVariants}>
              {info.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div className={styles.ctas} variants={itemVariants}>
              <a
                href="#projects"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>View My Work</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href={info.github || 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div className={styles.socials} variants={itemVariants}>
              {socialList.map((s) => {
                const url = s.url?.includes('@') && !s.url.startsWith('http') && !s.url.startsWith('mailto:')
                  ? `mailto:${s.url}`
                  : s.url || '#';
                const isMail = url.startsWith('mailto:');
                return (
                  <a
                    key={s.id || s.platform}
                    href={url}
                    target={isMail ? undefined : '_blank'}
                    rel={isMail ? undefined : 'noopener noreferrer'}
                    className={styles.socialLink}
                    title={s.label || s.platform}
                  >
                    <SocialIcon platform={s.platform} size={18} />
                  </a>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right: Cyberpunk Interactive Code Terminal */}
          <HeroTerminal personalInfo={info} />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className={styles.scrollLine} />
          <span className={styles.scrollText}>Scroll</span>
        </motion.div>
      </div>

      {/* Corner decoration */}
      <div className={styles.cornerTL} />
      <div className={styles.cornerBR} />
    </section>
  );
}
