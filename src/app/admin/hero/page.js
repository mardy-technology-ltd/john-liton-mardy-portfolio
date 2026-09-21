'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from '../adminForm.module.css';

export default function AdminHeroPage() {
  const { cmsData, updatePersonalInfo } = useCMS();
  const [form, setForm] = useState({
    name: cmsData?.personalInfo?.name || '',
    title: cmsData?.personalInfo?.title || '',
    tagline: cmsData?.personalInfo?.tagline || '',
    bio: cmsData?.personalInfo?.bio || '',
    email: cmsData?.personalInfo?.email || '',
    github: cmsData?.personalInfo?.github || '',
    linkedin: cmsData?.personalInfo?.linkedin || '',
    location: cmsData?.personalInfo?.location || '',
    availableForWork: cmsData?.personalInfo?.availableForWork ?? true,
    resumeUrl: cmsData?.personalInfo?.resumeUrl || '#',
  });

  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePersonalInfo(form);
    showToast('✓ Hero & Profile updated live!');
  };

  return (
    <div className={styles.container}>
      {toast && <motion.div className={styles.toast} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{toast}</motion.div>}

      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">&lt;// HERO &amp; PROFILE CUSTOMIZER /&gt;</span>
          <h1 className={styles.title}>Hero &amp; Personal Info</h1>
          <p className={styles.subtitle}>
            Manage your main identity, heading, subtitle, intro bio, and social profiles.
          </p>
        </div>
      </div>

      <div className={`glass-card ${styles.card}`}>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Professional Title (e.g. Software Engineer)</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Tagline / Headline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className={styles.input}
              placeholder="Building tomorrow's digital experiences, today."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Hero Short Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={styles.textarea}
              rows={4}
            />
          </div>

          <div className={styles.formGrid3}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>GitHub Profile URL</label>
              <input
                type="url"
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>LinkedIn Profile URL</label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Location (e.g. Dhaka, Bangladesh)</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Resume Download URL</label>
              <input
                type="text"
                value={form.resumeUrl}
                onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>

          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={form.availableForWork}
              onChange={(e) => setForm({ ...form, availableForWork: e.target.checked })}
              className={styles.checkbox}
            />
            <span className={styles.label}>&quot;Available for Work&quot; Badge Visible on Hero</span>
          </label>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
            Save &amp; Update Live Site
          </button>
        </form>
      </div>
    </div>
  );
}
