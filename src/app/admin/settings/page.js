'use client';

import { motion } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from '../adminForm.module.css';

const sectionLabels = {
  hero: { name: 'Hero / Header Section', desc: 'Main landing area with dynamic 3D graphic, name, title, and CTA buttons' },
  about: { name: 'About Me Section', desc: 'Background story, core engineering philosophy, and experience metrics' },
  skills: { name: 'Technical Skills Section', desc: 'Categorized tech arsenal with animated proficiency progress bars' },
  projects: { name: 'Featured Projects Section', desc: 'Interactive 3D tilt cards showcasing repositories and live platforms' },
  experience: { name: 'Experience Timeline Section', desc: 'Career history and engineering roles breakdown' },
  blog: { name: 'Articles & Blog Section', desc: 'Featured technical insights and knowledge base articles' },
  contact: { name: 'Contact & Let\'s Talk Section', desc: 'Interactive message form, email, and social connect links' },
};

export default function AdminSettingsPage() {
  const { cmsData, toggleSectionVisibility } = useCMS();
  const visibility = cmsData?.sectionVisibility || {};

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">&lt;// SITE CONFIG &amp; VISIBILITY /&gt;</span>
          <h1 className={styles.title}>Section Visibility Controls</h1>
          <p className={styles.subtitle}>
            Turn individual portfolio sections ON or OFF dynamically. Disabled sections will gracefully hide from the homepage and navigation.
          </p>
        </div>
      </div>

      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--clr-text-primary)' }}>
          Homepage Section Visibility Toggles
        </h2>

        <div className={styles.itemsList}>
          {Object.entries(sectionLabels).map(([key, info]) => {
            const isVisible = visibility[key] ?? true;
            return (
              <motion.div key={key} className={styles.itemCard} whileHover={{ scale: 1.01 }}>
                <div className={styles.itemLeft}>
                  <div>
                    <div className={styles.itemTitle}>
                      {info.name}
                    </div>
                    <div className={styles.itemSub}>{info.desc}</div>
                  </div>
                </div>

                <label className={styles.checkboxGroup} style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => toggleSectionVisibility(key)}
                    className={styles.checkbox}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 'bold', color: isVisible ? '#34d399' : '#f87171' }}>
                    {isVisible ? 'Enabled (Visible)' : 'Disabled (Hidden)'}
                  </span>
                </label>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
