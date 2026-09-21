'use client';

import { motion } from 'framer-motion';
import { experience } from '@/data/portfolio';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <section id="experience" className={`section ${styles.exp}`}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">Career</p>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">
            My professional journey — building impactful software at every step.
          </p>
        </motion.div>

        <div className={styles.timeline}>
          {experience.map((item, i) => (
            <motion.div
              key={item.id}
              className={styles.timelineItem}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              {/* Timeline line & dot */}
              <div className={styles.timelineLeft}>
                <div className={styles.period}>{item.period}</div>
              </div>

              <div className={styles.connector}>
                <div className={styles.dot}>
                  <div className={styles.dotInner} />
                </div>
                {i < experience.length - 1 && <div className={styles.line} />}
              </div>

              {/* Card */}
              <motion.div
                className={`glass-card ${styles.card}`}
                whileHover={{ scale: 1.02, borderColor: 'var(--clr-border-hover)' }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.role}>{item.role}</h3>
                    <p className={styles.company}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }}>
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      {item.company}
                    </p>
                  </div>
                  <span className={styles.periodBadge}>{item.period}</span>
                </div>

                <p className={styles.description}>{item.description}</p>

                <div className="tag-row">
                  {item.tech.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
