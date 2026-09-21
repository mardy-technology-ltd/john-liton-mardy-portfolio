'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { skills } from '@/data/portfolio';
import styles from './Skills.module.css';

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Cloud', 'DevOps'];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

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
          <p className="section-label">Technical Skills</p>
          <h2 className="section-title">My Tech Arsenal</h2>
          <p className="section-subtitle">
            Technologies and tools I use to bring ideas to life.
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

        {/* Skills Grid */}
        <motion.div className={styles.grid} layout>
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.name}
              className={`glass-card ${styles.skillCard}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ scale: 1.04, y: -4 }}
              style={{ '--skill-color': skill.color }}
            >
              {/* Skill Icon circle */}
              <div className={styles.skillIcon} style={{ background: `${skill.color}15`, borderColor: `${skill.color}30` }}>
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
                    whileInView={{ scaleX: skill.level / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
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
                style={{ background: `radial-gradient(circle at center, ${skill.color}10 0%, transparent 70%)` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
