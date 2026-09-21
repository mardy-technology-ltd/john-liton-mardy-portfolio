'use client';

import { motion } from 'framer-motion';
import TypeWriter from '@/components/ui/TypeWriter';
import SocialIcon from '@/components/ui/SocialIcon';
import HeroTerminal from '@/components/ui/HeroTerminal';
import { useCMS } from '@/context/CMSContext';
import { formatSocialUrl } from '@/data/cmsData';
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

  // Compute dynamic social links list filtered for Hero placement
  const rawSocialList = Array.isArray(info.socialLinks) && info.socialLinks.length > 0
    ? info.socialLinks
    : [
        ...(info.linkedin ? [{ id: 's-linkedin', platform: 'linkedin', label: 'LinkedIn', url: info.linkedin, placement: 'both' }] : []),
        ...(info.github ? [{ id: 's-github', platform: 'github', label: 'GitHub', url: info.github, placement: 'both' }] : []),
        ...(info.email ? [{ id: 's-email', platform: 'email', label: 'Email', url: info.email.startsWith('mailto:') ? info.email : `mailto:${info.email}`, placement: 'both' }] : []),
      ];

  const socialList = rawSocialList.filter((s) => s.placement === 'both' || s.placement === 'hero' || !s.placement);

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
            </motion.div>

            {/* Social links */}
            <motion.div className={styles.socials} variants={itemVariants}>
              {socialList.map((s) => {
                const rawUrl = s.url || (s.label?.startsWith('http') ? s.label : '#');
                const url = formatSocialUrl(rawUrl, s.platform);
                const isMail = url.startsWith('mailto:');
                const isExternal = !isMail && url !== '#' && (url.startsWith('http://') || url.startsWith('https://'));

                return (
                  <a
                    key={s.id || s.platform}
                    href={url}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
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
    </section>
  );
}
