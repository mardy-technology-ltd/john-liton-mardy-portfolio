'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from '../adminForm.module.css';

export default function AdminAboutPage() {
  const { cmsData, updateAbout } = useCMS();

  const [form, setForm] = useState({
    label: (cmsData?.about?.label && !cmsData.about.label.includes('<//')) ? cmsData.about.label : 'Who I Am',
    title: cmsData?.about?.title || 'About Me',
    yearsExperience: cmsData?.about?.yearsExperience || '4+',
    projectsCompleted: cmsData?.about?.projectsCompleted || '25+',
    happyClients: cmsData?.about?.happyClients || '18+',
  });

  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateAbout(form);
    showToast('✓ About section updated live!');
  };

  return (
    <div className={styles.container}>
      {toast && <motion.div className={styles.toast} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{toast}</motion.div>}

      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">ABOUT SECTION</span>
          <h1 className={styles.title}>About Me &amp; Statistics</h1>
          <p className={styles.subtitle}>
            Manage your background story, philosophy, and key experience counters.
          </p>
        </div>
      </div>

      <div className={`glass-card ${styles.card}`}>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Section Sub-heading</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className={styles.input}
                placeholder="Who I Am"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Section Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', marginTop: '1rem', color: 'var(--clr-cyan)' }}>
            📊 Key Metric Counters
          </h3>

          <div className={styles.formGrid3}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Years of Experience</label>
              <input
                type="text"
                value={form.yearsExperience}
                onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                className={styles.input}
                placeholder="4+"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Projects Completed</label>
              <input
                type="text"
                value={form.projectsCompleted}
                onChange={(e) => setForm({ ...form, projectsCompleted: e.target.value })}
                className={styles.input}
                placeholder="25+"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Satisfied Clients</label>
              <input
                type="text"
                value={form.happyClients}
                onChange={(e) => setForm({ ...form, happyClients: e.target.value })}
                className={styles.input}
                placeholder="18+"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
            Save &amp; Update Live Site
          </button>
        </form>
      </div>
    </div>
  );
}
