'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from '../adminForm.module.css';

export default function AdminExperiencePage() {
  const { cmsData, updateExperience } = useCMS();
  const experienceList = cmsData?.experience || [];

  const [form, setForm] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    tech: '',
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!form.role.trim() || !form.company.trim()) return;

    const techArray = typeof form.tech === 'string'
      ? form.tech.split(',').map((t) => t.trim()).filter(Boolean)
      : form.tech;

    const expObj = {
      id: editingIndex !== null ? experienceList[editingIndex]?.id || Date.now() : Date.now(),
      role: form.role,
      company: form.company,
      period: form.period,
      description: form.description,
      tech: techArray,
    };

    let updated;
    if (editingIndex !== null) {
      updated = [...experienceList];
      updated[editingIndex] = expObj;
      setEditingIndex(null);
      showToast(`✓ Updated experience at "${form.company}"!`);
    } else {
      updated = [expObj, ...experienceList];
      showToast(`✓ Added experience at "${form.company}"!`);
    }

    updateExperience(updated);
    setForm({ role: '', company: '', period: '', description: '', tech: '' });
  };

  const handleEdit = (index) => {
    const item = experienceList[index];
    setForm({
      role: item.role,
      company: item.company,
      period: item.period,
      description: item.description,
      tech: Array.isArray(item.tech) ? item.tech.join(', ') : item.tech,
    });
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (index) => {
    const item = experienceList[index];
    if (window.confirm(`Delete experience at "${item.company}"?`)) {
      const updated = experienceList.filter((_, i) => i !== index);
      updateExperience(updated);
      showToast(`✓ Removed "${item.company}"`);
    }
  };

  return (
    <div className={styles.container}>
      {toast && <motion.div className={styles.toast} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{toast}</motion.div>}

      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">&lt;// CAREER &amp; EXPERIENCE TIMELINE /&gt;</span>
          <h1 className={styles.title}>Experience Timeline Manager</h1>
          <p className={styles.subtitle}>
            Manage your employment history, engineering roles, responsibilities, and technologies used.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--clr-text-primary)' }}>
          {editingIndex !== null ? '✏️ Edit Career Entry' : '➕ Add Career Experience'}
        </h2>
        <form onSubmit={handleAddOrUpdate} className={styles.form}>
          <div className={styles.formGrid3}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Job Role / Title</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={styles.input}
                placeholder="Senior Software Engineer"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Company Name</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={styles.input}
                placeholder="TechCorp Solutions"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Timeline / Period</label>
              <input
                type="text"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className={styles.input}
                placeholder="2023 — Present"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Key Responsibilities &amp; Achievements</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={styles.textarea}
              placeholder="Led full-stack architecture, optimized database queries, mentored engineers..."
              rows={3}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Technologies Used (Comma separated)</label>
            <input
              type="text"
              value={form.tech}
              onChange={(e) => setForm({ ...form, tech: e.target.value })}
              className={styles.input}
              placeholder="Next.js, Node.js, AWS, PostgreSQL, Docker"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingIndex !== null ? 'Save Experience Changes' : 'Add Experience Entry'}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditingIndex(null);
                  setForm({ role: '', company: '', period: '', description: '', tech: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing List */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Career Timeline ({experienceList.length})
        </h2>
        <div className={styles.itemsList}>
          <AnimatePresence>
            {experienceList.map((exp, index) => (
              <motion.div
                key={exp.id || index}
                className={styles.itemCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className={styles.itemLeft}>
                  <div>
                    <div className={styles.itemTitle}>
                      {exp.role} <span style={{ color: 'var(--clr-cyan)' }}>@ {exp.company}</span>
                    </div>
                    <div className={styles.itemSub}>
                      {exp.period} • {Array.isArray(exp.tech) ? exp.tech.join(', ') : exp.tech}
                    </div>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button onClick={() => handleEdit(index)} className={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(index)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
