'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import { availableSocialPlatforms, defaultSocialLinks } from '@/data/cmsData';
import SocialIcon from '@/components/ui/SocialIcon';
import styles from '../adminForm.module.css';

export default function AdminHeroPage() {
  const { cmsData, updatePersonalInfo } = useCMS();

  const [form, setForm] = useState({
    name: cmsData?.personalInfo?.name || '',
    title: cmsData?.personalInfo?.title || '',
    tagline: cmsData?.personalInfo?.tagline || '',
    bio: cmsData?.personalInfo?.bio || '',
    location: cmsData?.personalInfo?.location || '',
    availableForWork: cmsData?.personalInfo?.availableForWork ?? true,
    resumeUrl: cmsData?.personalInfo?.resumeUrl || '#',
  });

  const [socialLinks, setSocialLinks] = useState(() => {
    if (cmsData?.personalInfo?.socialLinks && cmsData.personalInfo.socialLinks.length > 0) {
      return cmsData.personalInfo.socialLinks;
    }
    return defaultSocialLinks;
  });

  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleAddSocial = (platformId = 'globe', defaultLabel = '') => {
    const platformObj = availableSocialPlatforms.find((p) => p.id === platformId);
    const newLink = {
      id: 'social_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      platform: platformId,
      label: defaultLabel || platformObj?.name || 'Custom Link',
      url: platformId === 'email' ? 'mailto:' : 'https://',
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const handleUpdateSocial = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    
    // If platform changed, auto-suggest label if label was generic or empty
    if (field === 'platform') {
      const platformObj = availableSocialPlatforms.find((p) => p.id === value);
      if (platformObj && (!updated[index].label || availableSocialPlatforms.some(p => p.name === updated[index].label))) {
        updated[index].label = platformObj.name;
      }
    }
    setSocialLinks(updated);
  };

  const handleRemoveSocial = (index) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updated);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;
    const updated = [...socialLinks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSocialLinks(updated);
  };

  const handleSave = (e) => {
    e?.preventDefault();
    
    // Auto-extract primary handles for legacy backward compatibility
    const githubLink = socialLinks.find(s => s.platform === 'github')?.url || '';
    const linkedinLink = socialLinks.find(s => s.platform === 'linkedin')?.url || '';
    const emailLink = socialLinks.find(s => s.platform === 'email')?.url?.replace(/^mailto:/, '') || '';

    updatePersonalInfo({
      ...form,
      socialLinks,
      github: githubLink || cmsData?.personalInfo?.github,
      linkedin: linkedinLink || cmsData?.personalInfo?.linkedin,
      email: emailLink || cmsData?.personalInfo?.email,
    });

    showToast('✓ Hero & Social Links updated successfully!');
  };

  return (
    <div className={styles.container}>
      {toast && (
        <motion.div
          className={styles.toast}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {toast}
        </motion.div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">HERO &amp; PROFILE</span>
          <h1 className={styles.title}>Hero &amp; Social Links</h1>
          <p className={styles.subtitle}>
            Manage your headline, introduction, and connect all your custom social media channels &amp; developer handles dynamically.
          </p>
        </div>
        <button type="button" onClick={handleSave} className="btn btn-primary">
          💾 Save Changes
        </button>
      </div>

      {/* Identity Card */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--clr-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>👤</span> Personal Identity &amp; Headline
        </h2>

        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={styles.input}
                placeholder="e.g. John Liton Mardy"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Professional Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={styles.input}
                placeholder="e.g. Software Engineer / Full-Stack Architect"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Hero Tagline / Headline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className={styles.input}
              placeholder="Building tomorrow's digital experiences, today."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Hero Intro Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={styles.textarea}
              placeholder="A short punchy intro summary for the hero section..."
              rows={3}
            />
          </div>

          <div className={styles.formGrid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={styles.input}
                placeholder="e.g. Dhaka, Bangladesh"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Resume Download URL / Link</label>
              <input
                type="text"
                value={form.resumeUrl}
                onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                className={styles.input}
                placeholder="e.g. /resume.pdf or Google Drive link"
              />
            </div>
          </div>

          <label className={styles.checkboxGroup} style={{ marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              checked={form.availableForWork}
              onChange={(e) => setForm({ ...form, availableForWork: e.target.checked })}
              className={styles.checkbox}
            />
            <span className={styles.label}>Show &quot;Available for Work&quot; Live Glowing Badge</span>
          </label>
        </form>
      </div>

      {/* Social Media & Channels Manager */}
      <div className={`glass-card ${styles.card}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--clr-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <span>🌐</span> Dynamic Social Media &amp; Handles
            </h2>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Add, remove, or customize any social media channel. These appear on your Hero, Contact, and Footer sections with official icons.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleAddSocial('globe', 'My Website')}
            className="btn btn-outline"
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          >
            + Add Custom Link
          </button>
        </div>

        {/* Quick Add Presets */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.6rem' }}>
            ⚡ QUICK ADD SOCIAL PLATFORMS:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {availableSocialPlatforms.map((platform) => {
              const alreadyAdded = socialLinks.some((s) => s.platform === platform.id);
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => handleAddSocial(platform.id, platform.name)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    background: alreadyAdded ? 'rgba(0, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${alreadyAdded ? 'var(--clr-cyan)' : 'var(--clr-border)'}`,
                    color: alreadyAdded ? 'var(--clr-cyan)' : 'var(--clr-text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <SocialIcon platform={platform.id} size={14} />
                  <span>{platform.name}</span>
                  <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>+</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Social Links List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {socialLinks.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto auto 180px 1fr auto',
                  gap: '0.85rem',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--clr-border)',
                }}
              >
                {/* Reorder Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: index === 0 ? 'var(--clr-text-muted)' : 'var(--clr-text-primary)',
                      cursor: index === 0 ? 'default' : 'pointer',
                      fontSize: '0.75rem',
                      padding: '0 2px',
                    }}
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === socialLinks.length - 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: index === socialLinks.length - 1 ? 'var(--clr-text-muted)' : 'var(--clr-text-primary)',
                      cursor: index === socialLinks.length - 1 ? 'default' : 'pointer',
                      fontSize: '0.75rem',
                      padding: '0 2px',
                    }}
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>

                {/* Live Icon Preview */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(0, 255, 255, 0.08)',
                    border: '1px solid var(--clr-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--clr-cyan)',
                    flexShrink: 0,
                  }}
                  title={`Icon: ${item.platform}`}
                >
                  <SocialIcon platform={item.platform} size={18} />
                </div>

                {/* Platform Selector */}
                <div>
                  <select
                    value={item.platform}
                    onChange={(e) => handleUpdateSocial(index, 'platform', e.target.value)}
                    className={styles.select}
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    {availableSocialPlatforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Label & URL Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateSocial(index, 'label', e.target.value)}
                    placeholder="Label (e.g. LinkedIn)"
                    className={styles.input}
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => handleUpdateSocial(index, 'url', e.target.value)}
                    placeholder={
                      item.platform === 'email'
                        ? 'mailto:your.email@example.com'
                        : `https://${item.platform}.com/username`
                    }
                    className={styles.input}
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(index)}
                  className={styles.deleteBtn}
                  style={{ padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  title="Remove this link"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {socialLinks.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                border: '1px dashed var(--clr-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--clr-text-secondary)',
              }}
            >
              <p>No social links added yet. Click one of the quick buttons above or &quot;+ Add Custom Link&quot; to get started.</p>
            </div>
          )}
        </div>

        {/* Bottom Save Action */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button type="button" onClick={handleSave} className="btn btn-primary">
            💾 Save &amp; Update Live Site
          </button>
        </div>
      </div>
    </div>
  );
}
