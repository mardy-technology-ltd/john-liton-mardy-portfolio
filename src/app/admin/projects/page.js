'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from '../adminForm.module.css';

export default function AdminProjectsPage() {
  const { cmsData, updateProjects } = useCMS();
  const projectsList = cmsData?.projects || [];

  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    github: '',
    live: '',
    featured: false,
    color: '#00ffff',
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const tagsArray = typeof form.tags === 'string'
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : form.tags;

    const projectObj = {
      id: editingIndex !== null ? projectsList[editingIndex]?.id || Date.now() : Date.now(),
      title: form.title,
      description: form.description,
      tags: tagsArray,
      github: form.github || null,
      live: form.live || null,
      featured: Boolean(form.featured),
      color: form.color,
    };

    let updated;
    if (editingIndex !== null) {
      updated = [...projectsList];
      updated[editingIndex] = projectObj;
      setEditingIndex(null);
      showToast(`✓ Updated project "${form.title}"!`);
    } else {
      updated = [projectObj, ...projectsList];
      showToast(`✓ Added project "${form.title}"!`);
    }

    updateProjects(updated);
    setForm({ title: '', description: '', tags: '', github: '', live: '', featured: false, color: '#00ffff' });
  };

  const handleEdit = (index) => {
    const item = projectsList[index];
    setForm({
      title: item.title,
      description: item.description,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,
      github: item.github || '',
      live: item.live || '',
      featured: item.featured,
      color: item.color || '#00ffff',
    });
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (index) => {
    const item = projectsList[index];
    if (window.confirm(`Delete project "${item.title}"?`)) {
      const updated = projectsList.filter((_, i) => i !== index);
      updateProjects(updated);
      showToast(`✓ Removed "${item.title}"`);
    }
  };

  return (
    <div className={styles.container}>
      {toast && <motion.div className={styles.toast} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{toast}</motion.div>}

      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">PROJECTS &amp; SHOWCASE</span>
          <h1 className={styles.title}>Projects Showcase Manager</h1>
          <p className={styles.subtitle}>
            Manage portfolio projects, tech stacks, live links, repository URLs, and featured badges.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--clr-text-primary)' }}>
          {editingIndex !== null ? '✏️ Edit Project' : '➕ Add New Project'}
        </h2>
        <form onSubmit={handleAddOrUpdate} className={styles.form}>
          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Project Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={styles.input}
                placeholder="e.g. NexaShop — E-Commerce Platform"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Accent Highlight Color</label>
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

          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={styles.textarea}
              placeholder="Describe the architecture, key features, and performance achievements..."
              rows={3}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Tags (Comma separated: Next.js, Node.js, Stripe, Redis)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className={styles.input}
              placeholder="Next.js, Node.js, MongoDB, Tailwind"
            />
          </div>

          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>GitHub Repository URL</label>
              <input
                type="url"
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                className={styles.input}
                placeholder="https://github.com/..."
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Live Demo URL</label>
              <input
                type="url"
                value={form.live}
                onChange={(e) => setForm({ ...form, live: e.target.value })}
                className={styles.input}
                placeholder="https://..."
              />
            </div>
          </div>

          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className={styles.checkbox}
            />
            <span className={styles.label}>★ Highlight as &quot;Featured Project&quot;</span>
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingIndex !== null ? 'Save Project Changes' : 'Create Project'}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditingIndex(null);
                  setForm({ title: '', description: '', tags: '', github: '', live: '', featured: false, color: '#00ffff' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Projects */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Showcase Projects ({projectsList.length})
        </h2>
        <div className={styles.itemsList}>
          <AnimatePresence>
            {projectsList.map((project, index) => (
              <motion.div
                key={project.id || index}
                className={styles.itemCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className={styles.itemLeft}>
                  <div
                    style={{
                      width: '4px',
                      height: '40px',
                      borderRadius: '2px',
                      background: project.color || 'var(--clr-cyan)',
                    }}
                  />
                  <div>
                    <div className={styles.itemTitle}>
                      {project.title}
                      {project.featured && (
                        <span style={{ fontSize: '0.72rem', color: '#ffbd2e', marginLeft: '0.5rem' }}>
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <div className={styles.itemSub}>
                      {Array.isArray(project.tags) ? project.tags.join(' • ') : project.tags}
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
