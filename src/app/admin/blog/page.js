'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from '../adminForm.module.css';

export default function AdminBlogPage() {
  const { cmsData, updateBlogs } = useCMS();
  const blogsList = cmsData?.blogs || [];

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '/images/blog/nextjs-performance.svg',
    publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: '5 min read',
    tags: 'Next.js, React, Architecture',
    featured: true,
    contentRaw: `Building modern web applications requires balancing developer velocity with end-user performance.

## 1. Key Architectural Principles
Keep client components at the leaves of your component tree. Fetch data in Server Components and pass it down as props.

## 2. High-Performance Caching
Incremental Static Regeneration provides instant CDN response times.`,
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleTitleChange = (val) => {
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: editingIndex !== null ? prev.slug : slugified,
    }));
  };

  const parseContentFromRaw = (rawText) => {
    const lines = rawText.split('\n\n');
    return lines.map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('## ')) {
        return { type: 'heading2', text: trimmed.replace('## ', '') };
      }
      return { type: 'paragraph', text: trimmed };
    });
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;

    const tagsArray = typeof form.tags === 'string'
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : form.tags;

    const parsedContent = parseContentFromRaw(form.contentRaw);

    const postObj = {
      id: editingIndex !== null ? blogsList[editingIndex]?.id || Date.now() : Date.now(),
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      coverImage: form.coverImage,
      publishedAt: form.publishedAt,
      readTime: form.readTime,
      tags: tagsArray,
      featured: Boolean(form.featured),
      author: {
        name: cmsData?.personalInfo?.name || 'John Liton Mardy',
        role: cmsData?.personalInfo?.title || 'Software Engineer',
        avatar: '/profile.jpg',
      },
      content: parsedContent,
    };

    let updated;
    if (editingIndex !== null) {
      updated = [...blogsList];
      updated[editingIndex] = postObj;
      setEditingIndex(null);
      showToast(`✓ Updated article "${form.title}"!`);
    } else {
      updated = [postObj, ...blogsList];
      showToast(`✓ Published article "${form.title}"!`);
    }

    updateBlogs(updated);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      coverImage: '/images/blog/nextjs-performance.svg',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      tags: '',
      featured: false,
      contentRaw: '',
    });
  };

  const handleEdit = (index) => {
    const item = blogsList[index];
    const rawContent = item.content
      ? item.content
          .map((c) => (c.type === 'heading2' ? `## ${c.text}` : c.text || ''))
          .join('\n\n')
      : '';

    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      coverImage: item.coverImage || '/images/blog/nextjs-performance.svg',
      publishedAt: item.publishedAt,
      readTime: item.readTime,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,
      featured: item.featured,
      contentRaw: rawContent,
    });
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (index) => {
    const item = blogsList[index];
    if (window.confirm(`Delete article "${item.title}"?`)) {
      const updated = blogsList.filter((_, i) => i !== index);
      updateBlogs(updated);
      showToast(`✓ Removed "${item.title}"`);
    }
  };

  return (
    <div className={styles.container}>
      {toast && <motion.div className={styles.toast} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{toast}</motion.div>}

      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">&lt;// BLOG &amp; ARTICLES MANAGER /&gt;</span>
          <h1 className={styles.title}>Articles &amp; Knowledge Base</h1>
          <p className={styles.subtitle}>
            Write and publish technical articles, update meta info, manage tags, and set featured articles.
          </p>
        </div>
      </div>

      {/* Editor Form */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--clr-text-primary)' }}>
          {editingIndex !== null ? '✏️ Edit Article' : '✍️ Write New Technical Article'}
        </h2>
        <form onSubmit={handleAddOrUpdate} className={styles.form}>
          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Article Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={styles.input}
                placeholder="e.g. Architecting Scalable Cloud Microservices"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>URL Slug (e.g. /blog/my-article-slug)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Short Summary / Excerpt (SEO Description)</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={styles.textarea}
              placeholder="A brief overview of what readers will learn in this post..."
              rows={2}
              required
            />
          </div>

          <div className={styles.formGrid3}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tags (Comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className={styles.input}
                placeholder="Next.js, Three.js, React"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Estimated Read Time</label>
              <input
                type="text"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                className={styles.input}
                placeholder="6 min read"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Cover Image Path</label>
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className={styles.input}
                placeholder="/images/blog/nextjs-performance.svg"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Article Content (Use &quot;## Section Title&quot; for Headings, Double Enter for Paragraphs)
            </label>
            <textarea
              value={form.contentRaw}
              onChange={(e) => setForm({ ...form, contentRaw: e.target.value })}
              className={styles.textarea}
              style={{ minHeight: '220px', fontFamily: 'monospace', fontSize: '0.9rem' }}
              rows={8}
              required
            />
          </div>

          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className={styles.checkbox}
            />
            <span className={styles.label}>★ Feature this article on the Homepage</span>
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingIndex !== null ? 'Save Article Updates' : 'Publish Article'}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditingIndex(null);
                  setForm({
                    title: '',
                    slug: '',
                    excerpt: '',
                    coverImage: '/images/blog/nextjs-performance.svg',
                    publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    readTime: '5 min read',
                    tags: '',
                    featured: false,
                    contentRaw: '',
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Articles List */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Published Articles ({blogsList.length})
        </h2>
        <div className={styles.itemsList}>
          <AnimatePresence>
            {blogsList.map((post, index) => (
              <motion.div
                key={post.slug || index}
                className={styles.itemCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className={styles.itemLeft}>
                  <div>
                    <div className={styles.itemTitle}>
                      {post.title}
                      {post.featured && (
                        <span style={{ fontSize: '0.72rem', color: '#ffbd2e', marginLeft: '0.5rem' }}>
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <div className={styles.itemSub}>
                      {post.publishedAt} • {post.readTime} • /blog/{post.slug}
                    </div>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <a href={`/blog/${post.slug}`} target="_blank" className={styles.editBtn} style={{ textDecoration: 'none' }}>
                    View ↗
                  </a>
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
