'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks as defaultNavLinks } from '@/data/portfolio';
import { useCMS } from '@/context/CMSContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { personalInfo, sectionVisibility } = useCMS();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  // true = hero name has scrolled out of view → show full name in navbar
  const [namePassed, setNamePassed] = useState(false);

  // Filter dynamic navigation links based on section visibility
  const activeNavLinks = defaultNavLinks.filter((link) => {
    const key = link.href.replace('#', '');
    if (key === 'hero') return true;
    if (sectionVisibility && key in sectionVisibility) {
      return Boolean(sectionVisibility[key]);
    }
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = activeNavLinks.map((l) => l.href.replace('#', ''));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }

      // Detect whether the hero name (h1) has scrolled out of view
      const heroName = document.getElementById('hero-name');
      if (heroName) {
        const rect = heroName.getBoundingClientRect();
        // When the bottom of the name goes above the navbar (top of screen)
        setNamePassed(rect.bottom < 80);
      } else {
        // Fallback: use scrollY threshold
        setNamePassed(window.scrollY > 280);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeNavLinks]);

  const scrollToSection = (id) => {
    if (id === 'hero' || id === '') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    const nav = document.querySelector('nav');
    const navHeight = nav ? nav.getBoundingClientRect().height : 70;
    const elementTop = el.getBoundingClientRect().top + window.scrollY;
    const scrollTarget = Math.max(0, elementTop - navHeight);

    try {
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, scrollTarget);
    }
  };

  const handleLinkClick = (e, href) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }

    e.preventDefault();
    const id = href.replace('#', '');

    if (mobileOpen) {
      setMobileOpen(false);
      setTimeout(() => scrollToSection(id), 350);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className={styles.navInner}>

        {/* Logo — shows Dynamic Name only after name scrolls off screen */}
        <a
          href="#hero"
          className={styles.logo}
          onClick={(e) => handleLinkClick(e, '#hero')}
        >
          <AnimatePresence mode="wait">
            {namePassed && (
              <motion.span
                key="fullname"
                className={styles.logoFullName}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {personalInfo?.name?.toUpperCase() || 'PORTFOLIO'}
              </motion.span>
            )}
          </AnimatePresence>
        </a>

        {/* Desktop Links */}
        <ul className={styles.links}>
          {activeNavLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`${styles.link} ${isActive ? styles.active : ''}`}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      className={styles.activeDot}
                      layoutId="activeNavDot"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <a
          href={`mailto:${personalInfo?.email || 'contact@example.com'}`}
          className={`btn btn-outline ${styles.ctaBtn}`}
        >
          Hire Me
        </a>

        {/* Mobile Hamburger — hidden while hero name is visible */}
        <AnimatePresence>
          {namePassed && (
            <motion.button
              className={styles.hamburger}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              <span className={`${styles.bar} ${mobileOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${mobileOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${mobileOpen ? styles.open : ''}`} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeNavLinks.map((link, i) => (
              <motion.button
                key={link.href}
                className={styles.mobileLink}
                onClick={(e) => handleLinkClick(e, link.href)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
