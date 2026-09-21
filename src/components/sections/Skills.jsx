'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from './Skills.module.css';

const categories = ['Web & Frontend', 'Mobile & App', 'Backend & APIs', 'Cloud & DevOps'];

export default function Skills() {
  const { cmsData } = useCMS();
  const [activeCategory, setActiveCategory] = useState('Web & Frontend');

  const allSkills = cmsData?.skills || [];
  const filtered = allSkills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className={`section ${styles.skills}`}>
      <div className={`orb orb-cyan ${styles.orb}`} style={{ width: 350, height: 350 }} />

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">What I Know</p>
          <h2 className="section-title">My Tech Arsenal</h2>
          <p className="section-subtitle">
            Technologies, frameworks, and tools I use to build scalable web &amp; mobile solutions.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className={styles.filters}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className={styles.grid}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.name}
                className={`glass-card ${styles.skillCard}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                style={{ '--skill-color': skill.color }}
              >
                {/* Skill Icon circle */}
                <div
                  className={styles.skillIcon}
                  style={{ background: `${skill.color}15`, borderColor: `${skill.color}35` }}
                >
                  <span className={styles.skillInitial} style={{ color: skill.color }}>
                    {skill.name.charAt(0)}
                  </span>
                </div>

                {/* Info */}
                <div className={styles.skillInfo}>
                  <div className={styles.skillHeader}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillLevel} style={{ color: skill.color }}>
                      {skill.level}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: skill.level / 100 }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease: 'easeOut' }}
                      style={{
                        background: `linear-gradient(90deg, ${skill.color}, var(--clr-purple))`,
                        boxShadow: `0 0 8px ${skill.color}60`,
                      }}
                    />
                  </div>

                  <span className={styles.skillCategory}>{skill.category}</span>
                </div>

                {/* Glow effect on hover */}
                <div
                  className={styles.cardGlow}
                  style={{ background: `radial-gradient(circle at center, ${skill.color}15 0%, transparent 70%)` }}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
