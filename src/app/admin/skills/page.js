'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from '../adminForm.module.css';

const categories = ['Web & Frontend', 'Mobile & App', 'Backend & APIs', 'Cloud & DevOps'];

export default function AdminSkillsPage() {
  const { cmsData, updateSkills } = useCMS();
  const skillsList = cmsData?.skills || [];

  const [form, setForm] = useState({
    name: '',
    category: 'Web & Frontend',
    color: '#00ffff',
    level: 90,
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    let updated;
    if (editingIndex !== null) {
      updated = [...skillsList];
      updated[editingIndex] = { ...form, level: Number(form.level) };
      setEditingIndex(null);
      showToast(`✓ Updated "${form.name}"!`);
    } else {
      updated = [...skillsList, { ...form, level: Number(form.level) }];
      showToast(`✓ Added "${form.name}" to skills!`);
    }

    updateSkills(updated);
    setForm({ name: '', category: 'Web & Frontend', color: '#00ffff', level: 90 });
  };

  const handleEdit = (index) => {
    const item = skillsList[index];
    setForm({ ...item });
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (index) => {
    const item = skillsList[index];
    if (window.confirm(`Delete skill "${item.name}"?`)) {
      const updated = skillsList.filter((_, i) => i !== index);
      updateSkills(updated);
      showToast(`✓ Removed "${item.name}"`);
    }
  };

  return (
    <div className={styles.container}>
      {toast && <motion.div className={styles.toast} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{toast}</motion.div>}

      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">&lt;// SKILLS &amp; ARSENAL MANAGER /&gt;</span>
          <h1 className={styles.title}>Technical Skills Manager</h1>
          <p className={styles.subtitle}>
            Add, update, or remove technical skills, set category groups, badge colors, and proficiency levels.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--clr-text-primary)' }}>
          {editingIndex !== null ? '✏️ Edit Skill' : '➕ Add New Technical Skill'}
        </h2>
        <form onSubmit={handleAddOrUpdate} className={styles.form}>
          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Skill Name (e.g. Next.js, Flutter)</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={styles.input}
                placeholder="Skill name"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={styles.select}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Proficiency Level: <strong>{form.level}%</strong>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                style={{ width: '100%', accentColor: form.color, marginTop: '0.5rem' }}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Skill Accent Color</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  style={{ width: '45px', height: '40px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingIndex !== null ? 'Save Changes' : 'Add Skill'}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditingIndex(null);
                  setForm({ name: '', category: 'Web & Frontend', color: '#00ffff', level: 90 });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Skills List */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Current Skills ({skillsList.length})
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>
          Skills currently active on the live website.
        </p>

        <div className={styles.itemsList}>
          <AnimatePresence>
            {skillsList.map((skill, index) => (
              <motion.div
                key={skill.name + index}
                className={styles.itemCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className={styles.itemLeft}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: `${skill.color}15`,
                      border: `1px solid ${skill.color}40`,
                      color: skill.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {skill.name.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.itemTitle}>{skill.name}</div>
                    <div className={styles.itemSub}>
                      {skill.category} • <strong style={{ color: skill.color }}>{skill.level}%</strong>
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
