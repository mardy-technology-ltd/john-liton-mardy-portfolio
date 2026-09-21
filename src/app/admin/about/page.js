'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCMS } from '@/context/CMSContext';
import { avatarAnimationOptions, avatarShapeOptions } from '@/data/cmsData';
import styles from '../adminForm.module.css';
import aboutStyles from '@/components/sections/About.module.css';

const defaultWhatIDo = [
  'Build scalable full-stack web & mobile apps',
  'Create immersive 3D web experiences',
  'Architect clean, maintainable codebases',
  'Optimize for performance & accessibility',
];

export default function AdminAboutPage() {
  const { cmsData, updateAbout, updatePersonalInfo, isLoaded } = useCMS();

  const [form, setForm] = useState({
    label: (cmsData?.about?.label && !cmsData.about.label.includes('<//')) ? cmsData.about.label : 'Who I Am',
    title: cmsData?.about?.title || 'About Me',
    subtitle: cmsData?.about?.subtitle || 'A glimpse into who I am, what drives me, and the journey that shaped my craft.',
    secondaryBio: cmsData?.about?.secondaryBio || 'I specialize in building full-stack web & mobile applications and have a deep passion for 3D interactive digital experiences. I believe great software is both technically sound and a joy to use.',
    avatarImage: cmsData?.about?.avatarImage || '/profile.jpg',
    avatarShape: cmsData?.about?.avatarShape || 'morphing-bubble',
    avatarAnimation: cmsData?.about?.avatarAnimation || 'morph',
    showOrbitRings: cmsData?.about?.showOrbitRings ?? true,
    showCornerBrackets: cmsData?.about?.showCornerBrackets ?? true,
    showLocationBadge: cmsData?.about?.showLocationBadge ?? true,
    location: cmsData?.personalInfo?.location || 'Dhaka, Bangladesh',
    yearsExperience: cmsData?.about?.yearsExperience || '4+',
    projectsCompleted: cmsData?.about?.projectsCompleted || '25+',
    happyClients: cmsData?.about?.happyClients || '18+',
  });

  const [whatIDo, setWhatIDo] = useState(() => {
    if (Array.isArray(cmsData?.about?.whatIDo) && cmsData.about.whatIDo.length > 0) {
      return cmsData.about.whatIDo;
    }
    return defaultWhatIDo;
  });

  // Sync state once when CMS finishes loading from localStorage on initial mount
  useEffect(() => {
    if (isLoaded && cmsData?.about) {
      setForm((prev) => ({
        ...prev,
        label: (cmsData.about.label && !cmsData.about.label.includes('<//')) ? cmsData.about.label : prev.label,
        title: cmsData.about.title ?? prev.title,
        subtitle: cmsData.about.subtitle ?? prev.subtitle,
        secondaryBio: cmsData.about.secondaryBio ?? prev.secondaryBio,
        avatarImage: cmsData.about.avatarImage ?? prev.avatarImage,
        avatarShape: cmsData.about.avatarShape ?? prev.avatarShape,
        avatarAnimation: cmsData.about.avatarAnimation ?? prev.avatarAnimation,
        showOrbitRings: cmsData.about.showOrbitRings ?? prev.showOrbitRings,
        showCornerBrackets: cmsData.about.showCornerBrackets ?? prev.showCornerBrackets,
        showLocationBadge: cmsData.about.showLocationBadge ?? prev.showLocationBadge,
        location: cmsData.personalInfo?.location || cmsData.about.location || prev.location,
        yearsExperience: cmsData.about.yearsExperience ?? prev.yearsExperience,
        projectsCompleted: cmsData.about.projectsCompleted ?? prev.projectsCompleted,
        happyClients: cmsData.about.happyClients ?? prev.happyClients,
      }));
      if (Array.isArray(cmsData.about.whatIDo) && cmsData.about.whatIDo.length > 0) {
        setWhatIDo(cmsData.about.whatIDo);
      }
    }
  }, [isLoaded]);

  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleAddBullet = () => {
    setWhatIDo([...whatIDo, '']);
  };

  const handleUpdateBullet = (index, val) => {
    const updated = [...whatIDo];
    updated[index] = val;
    setWhatIDo(updated);
  };

  const handleRemoveBullet = (index) => {
    const updated = whatIDo.filter((_, i) => i !== index);
    setWhatIDo(updated);
  };

  const handleSave = (e) => {
    e?.preventDefault();
    const cleanBullets = whatIDo.filter((b) => b.trim().length > 0);
    
    // Save About settings
    updateAbout({
      ...form,
      whatIDo: cleanBullets.length > 0 ? cleanBullets : defaultWhatIDo,
    });

    // Also update global personalInfo location for synchronization
    if (form.location) {
      updatePersonalInfo({ location: form.location });
    }

    showToast('✓ About, Location & Profile Visual Settings saved live!');
  };

  // Find active option descriptions
  let activeShapeDesc = '';
  for (const cat of avatarShapeOptions) {
    const found = cat.options.find((o) => o.id === form.avatarShape);
    if (found) {
      activeShapeDesc = found.desc;
      break;
    }
  }

  let activeAnimDesc = '';
  for (const cat of avatarAnimationOptions) {
    const found = cat.options.find((o) => o.id === form.avatarAnimation);
    if (found) {
      activeAnimDesc = found.desc;
      break;
    }
  }

  return (
    <div className={styles.container}>
      {toast && (
        <motion.div
          className={styles.toast}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {toast}
        </motion.div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">ABOUT SECTION</span>
          <h1 className={styles.title}>About Me &amp; Profile Studio</h1>
          <p className={styles.subtitle}>
            Manage your background story, customize your profile avatar frame shape &amp; multi-category animation effects, update your location badge, and configure key experience counters.
          </p>
        </div>
        <button type="button" onClick={handleSave} className="btn btn-primary">
          💾 Save Changes
        </button>
      </div>

      {/* 1. Profile Avatar & Categorized Animation Studio Card */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--clr-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🎨</span> Profile Avatar Animation &amp; Frame Studio
        </h2>
        <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Choose from 4 distinct visual categories of animation effects (Organic Liquid, Cyberpunk Sci-Fi, Quantum 3D Space, or Clean Minimal) and select your preferred avatar frame shape.
        </p>

        <div className={styles.formGrid2}>
          {/* Categorized Shape Selector */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Avatar Frame Shape / Style</label>
            <select
              value={form.avatarShape}
              onChange={(e) => {
                const newShape = e.target.value;
                setForm({
                  ...form,
                  avatarShape: newShape,
                  avatarAnimation: newShape === 'morphing-bubble' ? 'morph' : form.avatarAnimation,
                });
              }}
              className={styles.select}
            >
              {avatarShapeOptions.map((cat) => (
                <optgroup key={cat.category} label={cat.category}>
                  {cat.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {activeShapeDesc && (
              <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}>
                💡 {activeShapeDesc}
              </span>
            )}
          </div>

          {/* Categorized Animation Selector */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Avatar Animation Effect</label>
            <select
              value={form.avatarAnimation}
              onChange={(e) => setForm({ ...form, avatarAnimation: e.target.value })}
              className={styles.select}
            >
              {avatarAnimationOptions.map((cat) => (
                <optgroup key={cat.category} label={cat.category}>
                  {cat.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.icon} {opt.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {activeAnimDesc && (
              <span style={{ fontSize: '0.78rem', color: 'var(--clr-cyan)', marginTop: '0.25rem' }}>
                ✨ {activeAnimDesc}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formGrid2} style={{ marginTop: '1.25rem' }}>
          {/* Image Source URL */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Profile Image Path / URL</label>
            <input
              type="text"
              value={form.avatarImage}
              onChange={(e) => setForm({ ...form, avatarImage: e.target.value })}
              className={styles.input}
              placeholder="/profile.jpg or https://..."
            />
          </div>

          {/* Location Badge Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>📍 Location Badge Text</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={styles.input}
              placeholder="e.g. Dhaka, Bangladesh or New York, USA"
            />
          </div>
        </div>

        {/* Visual Elements Toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
          <label className={styles.checkboxGroup} style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={form.showLocationBadge}
              onChange={(e) => setForm({ ...form, showLocationBadge: e.target.checked })}
              className={styles.checkbox}
            />
            <span className={styles.label}>📍 Show Location Badge</span>
          </label>

          <label className={styles.checkboxGroup} style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={form.showOrbitRings}
              onChange={(e) => setForm({ ...form, showOrbitRings: e.target.checked })}
              className={styles.checkbox}
            />
            <span className={styles.label}>🪐 Show Orbiting Radar Rings</span>
          </label>

          <label className={styles.checkboxGroup} style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={form.showCornerBrackets}
              onChange={(e) => setForm({ ...form, showCornerBrackets: e.target.checked })}
              className={styles.checkbox}
            />
            <span className={styles.label}>📐 Show Corner Tech Brackets</span>
          </label>
        </div>

        {/* Live Interactive Preview Box */}
        <div style={{ marginTop: '1.75rem', padding: '1.5rem', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '14px', border: '1px solid var(--clr-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--clr-cyan)', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              👁️ Live Studio Preview
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>
              Shape: <strong style={{ color: '#fff' }}>{form.avatarShape}</strong> | FX: <strong style={{ color: 'var(--clr-cyan)' }}>{form.avatarAnimation}</strong>
            </span>
          </div>

          <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={`${aboutStyles.avatarContainer} ${
              form.avatarAnimation === 'lava-lamp'
                ? aboutStyles.animLavaLamp
                : form.avatarAnimation === 'jelly-bounce'
                ? aboutStyles.animJellyBounce
                : form.avatarAnimation === 'cyber-glitch'
                ? aboutStyles.animCyberGlitch
                : form.avatarAnimation === 'laser-scanner'
                ? aboutStyles.animLaserScanner
                : form.avatarAnimation === 'neon-pulsar'
                ? aboutStyles.animNeonPulsar
                : form.avatarAnimation === 'zero-g-float'
                ? aboutStyles.animZeroGFloat
                : form.avatarAnimation === 'event-horizon'
                ? aboutStyles.animEventHorizon
                : form.avatarAnimation === 'quantum-orbit'
                ? aboutStyles.animQuantumOrbit
                : form.avatarAnimation === 'rotating-conic'
                ? aboutStyles.animRotatingConic
                : form.avatarAnimation === 'pulse-glow'
                ? aboutStyles.animPulseGlow
                : form.avatarAnimation === 'pure-static'
                ? aboutStyles.animPureStatic
                : aboutStyles.animMorph
            }`}>
              <div className={`${aboutStyles.avatarInner} ${
                form.avatarShape === 'teardrop'
                  ? aboutStyles.shapeTeardrop
                  : form.avatarShape === 'modern-circle'
                  ? aboutStyles.shapeCircle
                  : form.avatarShape === 'rounded-squircle'
                  ? aboutStyles.shapeSquircle
                  : form.avatarShape === 'smooth-card'
                  ? aboutStyles.shapeSmoothCard
                  : form.avatarShape === 'cyber-hexagon'
                  ? aboutStyles.shapeHexagon
                  : form.avatarShape === 'cyber-octagon'
                  ? aboutStyles.shapeOctagon
                  : form.avatarShape === 'diamond-shield'
                  ? aboutStyles.shapeDiamondShield
                  : form.avatarShape === 'cyber-box'
                  ? aboutStyles.shapeCyberBox
                  : aboutStyles.shapeMorphBubble
              }`}>
                <Image
                  src={form.avatarImage || '/profile.jpg'}
                  alt="Avatar Preview"
                  fill
                  className={aboutStyles.avatarImage}
                  sizes="220px"
                  priority
                />
              </div>
            </div>

            {/* Orbiting rings preview */}
            {form.showOrbitRings && (
              <>
                <div className={`${aboutStyles.orbit} ${aboutStyles.orbit1}`} style={{ width: '250px', height: '250px' }} />
                <div className={`${aboutStyles.orbit} ${aboutStyles.orbit2}`} style={{ width: '280px', height: '280px' }} />
              </>
            )}

            {/* Corner brackets preview */}
            {form.showCornerBrackets && (
              <>
                <div className={aboutStyles.bracketTL} />
                <div className={aboutStyles.bracketBR} />
              </>
            )}
          </div>

          {form.showLocationBadge && (
            <div className={aboutStyles.locationBadge} style={{ marginTop: '0.5rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {form.location || 'Dhaka, Bangladesh'}
            </div>
          )}
        </div>
      </div>

      {/* 2. Story, Bio & Headings Card */}
      <div className={`glass-card ${styles.card}`}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--clr-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📝</span> Background Story &amp; Philosophy
        </h2>

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
                placeholder="About Me"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Section Tagline / Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className={styles.input}
              placeholder="A glimpse into who I am, what drives me, and the journey that shaped my craft."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Secondary Story &amp; Philosophy Paragraph</label>
            <textarea
              value={form.secondaryBio}
              onChange={(e) => setForm({ ...form, secondaryBio: e.target.value })}
              className={styles.textarea}
              placeholder="Write your secondary paragraph detailing your core tech specialization and philosophy..."
              rows={3}
            />
          </div>

          {/* What I Do Bullet Points */}
          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--clr-cyan)', margin: 0 }}>
                ⚡ &quot;What I Do&quot; Focus Points (Bullets)
              </h3>
              <button
                type="button"
                onClick={handleAddBullet}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                + Add Point
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <AnimatePresence>
                {whatIDo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                  >
                    <span style={{ color: 'var(--clr-cyan)', fontFamily: 'var(--font-mono)' }}>▹</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleUpdateBullet(index, e.target.value)}
                      placeholder="e.g. Build scalable full-stack web & mobile apps"
                      className={styles.input}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(index)}
                      className={styles.deleteBtn}
                      style={{ padding: '0.45rem 0.65rem' }}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
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

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1.5rem' }}>
            Save &amp; Update Live Site
          </button>
        </form>
      </div>
    </div>
  );
}
