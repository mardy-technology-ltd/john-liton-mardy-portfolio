'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import { themePresets, bgAnimationOptions } from '@/data/cmsData';
import styles from './adminTheme.module.css';

const categories = ['All', 'Developer & Sci-Fi', 'Executive & Luxury', 'Creative & Gradients'];
const animCategories = ['All', 'Code & Matrix', '3D & AI Networks', 'DevOps & Cloud', 'Hardware & Minimal'];

export default function AdminThemePage() {
  const { cmsData, setTheme, setCustomColors, updateThemeConfig } = useCMS();

  const currentThemeId = cmsData?.themeConfig?.activeTheme || 'cyberpunk-neon';
  const currentPreset = themePresets[currentThemeId] || themePresets['cyberpunk-neon'];
  const currentColors = cmsData?.themeConfig?.customColors || currentPreset.colors;

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [animCategory, setAnimCategory] = useState('All');
  const [animSearchQuery, setAnimSearchQuery] = useState('');

  const [customForm, setCustomForm] = useState({
    primary: currentColors.primary || '#00ffff',
    secondary: currentColors.secondary || '#a855f7',
    bgPrimary: currentColors.bgPrimary || '#030712',
    bgSecondary: currentColors.bgSecondary || '#0a0f1e',
    textPrimary: currentColors.textPrimary || '#e2e8f0',
    border: currentColors.border || 'rgba(0, 255, 255, 0.15)',
    glowPrimary: currentColors.primary || '#00ffff',
    glowSecondary: currentColors.secondary || '#a855f7',
  });

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectPreset = (presetId) => {
    setTheme(presetId);
    const selected = themePresets[presetId];
    if (selected) {
      setCustomForm({
        primary: selected.colors.primary,
        secondary: selected.colors.secondary,
        bgPrimary: selected.colors.bgPrimary,
        bgSecondary: selected.colors.bgSecondary,
        textPrimary: selected.colors.textPrimary,
        border: selected.colors.border,
        glowPrimary: selected.colors.primary,
        glowSecondary: selected.colors.secondary,
      });
    }
    showToast(`✓ Applied "${themePresets[presetId]?.name}" theme!`);
  };

  const handleApplyCustomColors = (e) => {
    e.preventDefault();
    setCustomColors({
      ...currentColors,
      ...customForm,
      border: `rgba(${hexToRgb(customForm.primary)}, 0.2)`,
      borderHover: `rgba(${hexToRgb(customForm.primary)}, 0.5)`,
      glowPrimary: customForm.primary,
      glowSecondary: customForm.secondary,
    });
    showToast('✓ Custom theme colors applied to live website!');
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 255, 255';
  };

  // Filtered presets
  const allPresets = Object.values(themePresets);
  const filteredPresets = allPresets.filter((preset) => {
    const matchesCategory = activeCategory === 'All' || preset.category === activeCategory;
    const matchesSearch =
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.badge?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered background animations
  const filteredAnims = bgAnimationOptions.filter((opt) => {
    const matchesCategory = animCategory === 'All' || opt.category === animCategory;
    const matchesSearch =
      opt.name.toLowerCase().includes(animSearchQuery.toLowerCase()) ||
      opt.description.toLowerCase().includes(animSearchQuery.toLowerCase()) ||
      opt.badge?.toLowerCase().includes(animSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.themeStudio}>
      {/* Toast */}
      {toastMessage && (
        <motion.div
          className={styles.toast}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {toastMessage}
        </motion.div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">THEME &amp; VISUAL ENGINE</span>
          <h1 className={styles.title}>Live Theme Studio</h1>
          <p className={styles.subtitle}>
            Select from 16 highly curated professional theme presets across Developer, Executive &amp; Creative palettes, or craft your custom color spectrum.
          </p>
        </div>
      </div>

      {/* Preset Themes Section */}
      <section className={styles.section}>
        <div className={styles.presetHeaderRow}>
          <div>
            <h2 className={styles.sectionTitle}>1. Choose Theme Preset</h2>
            <p className={styles.sectionSub}>Pick from {allPresets.length} hand-crafted high-contrast professional color themes</p>
          </div>

          {/* Search Input */}
          <div className={styles.searchWrapper}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search theme or vibe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className={styles.categoryFilters}>
          {categories.map((cat) => {
            const count = cat === 'All' ? allPresets.length : allPresets.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`${styles.catBtn} ${isActive ? styles.catBtnActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat} <span className={styles.catCount}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Presets Grid */}
        <div className={styles.presetsGrid}>
          {filteredPresets.map((preset) => {
            const isSelected = currentThemeId === preset.id && !cmsData?.themeConfig?.customColors;
            return (
              <motion.div
                key={preset.id}
                className={`glass-card ${styles.presetCard} ${isSelected ? styles.presetActive : ''}`}
                onClick={() => handleSelectPreset(preset.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <div className={styles.presetTop}>
                  <div className={styles.presetTitleWrap}>
                    <h3 className={styles.presetName}>{preset.name}</h3>
                    {preset.badge && (
                      <span
                        className={styles.presetBadge}
                        style={{
                          color: preset.colors.primary,
                          borderColor: `${preset.colors.primary}40`,
                          backgroundColor: `${preset.colors.primary}15`,
                        }}
                      >
                        {preset.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && <span className={styles.activeTag}>✓ Active</span>}
                </div>

                <p className={styles.presetDesc}>{preset.description}</p>

                {/* Color Palette Chips */}
                <div className={styles.chipsRow}>
                  <div
                    className={styles.colorChip}
                    style={{ background: preset.colors.primary, boxShadow: `0 0 10px ${preset.colors.primary}` }}
                    title={`Primary: ${preset.colors.primary}`}
                  />
                  <div
                    className={styles.colorChip}
                    style={{ background: preset.colors.secondary, boxShadow: `0 0 10px ${preset.colors.secondary}` }}
                    title={`Secondary: ${preset.colors.secondary}`}
                  />
                  <div
                    className={styles.colorChip}
                    style={{ background: preset.colors.accentPink || preset.colors.primary }}
                    title={`Accent: ${preset.colors.accentPink || preset.colors.primary}`}
                  />
                  <div
                    className={styles.colorChip}
                    style={{ background: preset.colors.bgPrimary }}
                    title={`Background: ${preset.colors.bgPrimary}`}
                  />
                  <div
                    className={styles.colorChip}
                    style={{ background: preset.colors.textPrimary }}
                    title={`Text: ${preset.colors.textPrimary}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredPresets.length === 0 && (
          <div className={styles.emptySearch}>
            <p>No themes matched &ldquo;{searchQuery}&rdquo;. Try another search term!</p>
          </div>
        )}
      </section>

      {/* 2. Background Animation Style Selector */}
      <section className={styles.section}>
        <div className={styles.presetHeaderRow}>
          <div>
            <h2 className={styles.sectionTitle}>2. Choose Background Animation Style</h2>
            <p className={styles.sectionSub}>Select from {bgAnimationOptions.length} developer-centric 3D WebGL, AI, Matrix, and Cloud animations</p>
          </div>

          {/* Animation Search Input */}
          <div className={styles.searchWrapper}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search developer animation..."
              value={animSearchQuery}
              onChange={(e) => setAnimSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Animation Category Filter Pills */}
        <div className={styles.categoryFilters}>
          {animCategories.map((cat) => {
            const count = cat === 'All' ? bgAnimationOptions.length : bgAnimationOptions.filter((a) => a.category === cat).length;
            const isActive = animCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`${styles.catBtn} ${isActive ? styles.catBtnActive : ''}`}
                onClick={() => setAnimCategory(cat)}
              >
                {cat} <span className={styles.catCount}>({count})</span>
              </button>
            );
          })}
        </div>

        <div className={styles.bgAnimGrid}>
          {filteredAnims.map((opt) => {
            const isSelected = (cmsData?.themeConfig?.bgAnimation || 'particles') === opt.id;
            return (
              <motion.div
                key={opt.id}
                className={`glass-card ${styles.animCard} ${isSelected ? styles.animCardActive : ''}`}
                onClick={() => {
                  updateThemeConfig({ bgAnimation: opt.id });
                  showToast(`✓ Background animation set to "${opt.name}"`);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <div className={styles.animTop}>
                  <div className={styles.animIconTitle}>
                    <span className={styles.animIcon}>{opt.icon}</span>
                    <h3 className={styles.animName}>{opt.name}</h3>
                  </div>
                  <span
                    className={styles.animBadge}
                    style={{
                      color: isSelected ? 'var(--clr-cyan)' : 'var(--clr-text-muted)',
                      borderColor: isSelected ? 'var(--clr-cyan)' : 'var(--clr-border)',
                      backgroundColor: isSelected ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                    }}
                  >
                    {opt.badge}
                  </span>
                </div>
                <p className={styles.animDesc}>{opt.description}</p>
                <div className={styles.animFooter}>
                  {isSelected ? (
                    <span className={styles.activeTag}>✓ Currently Active</span>
                  ) : (
                    <span className={styles.selectPrompt}>Click to Apply</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAnims.length === 0 && (
          <div className={styles.emptySearch}>
            <p>No background animations matched &ldquo;{animSearchQuery}&rdquo;. Try another search term!</p>
          </div>
        )}

        {/* Animation Motion Controls */}
        <div className={`glass-card ${styles.motionControlsCard}`}>
          <div className={styles.motionControlsGrid}>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                <span>Animation Speed Multiplier</span>
                <span className={styles.controlVal}>{(cmsData?.themeConfig?.animationSpeed ?? 1)}x</span>
              </label>
              <div className={styles.speedButtons}>
                {[
                  { label: '0.5x Slow & Subtle', val: 0.5 },
                  { label: '1.0x Normal Speed', val: 1 },
                  { label: '1.8x High Energy', val: 1.8 },
                ].map((s) => {
                  const isCurrent = (cmsData?.themeConfig?.animationSpeed ?? 1) === s.val;
                  return (
                    <button
                      key={s.val}
                      type="button"
                      className={`${styles.speedBtn} ${isCurrent ? styles.speedBtnActive : ''}`}
                      onClick={() => {
                        updateThemeConfig({ animationSpeed: s.val });
                        showToast(`✓ Animation speed set to ${s.val}x`);
                      }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                <span>Particle Density (Count)</span>
                <span className={styles.controlVal}>{cmsData?.themeConfig?.particleCount ?? 1800} particles</span>
              </label>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={cmsData?.themeConfig?.particleCount ?? 1800}
                onChange={(e) => updateThemeConfig({ particleCount: Number(e.target.value) })}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>500 (Light)</span>
                <span>1800 (Balanced)</span>
                <span>3000 (Dense)</span>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                <span>3D Mouse Reactivity</span>
                <span className={styles.controlVal}>{(cmsData?.themeConfig?.mouseReactivity ?? true) ? 'Enabled' : 'Disabled'}</span>
              </label>
              <div className={styles.toggleRow}>
                <p className={styles.toggleInfo}>Particles drift and tilt based on cursor movement</p>
                <input
                  type="checkbox"
                  checked={cmsData?.themeConfig?.mouseReactivity ?? true}
                  onChange={(e) => updateThemeConfig({ mouseReactivity: e.target.checked })}
                  className={styles.checkbox}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Color Palette & Live Preview */}
      <section className={styles.customSection}>
        <div className={styles.customGrid}>
          {/* Custom Color Form */}
          <div className={`glass-card ${styles.formCard}`}>
            <h2 className={styles.sectionTitle}>3. Fine-Tune Custom Colors</h2>
            <form onSubmit={handleApplyCustomColors} className={styles.colorForm}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span>Primary Accent (Cyan / Neon)</span>
                  <span className={styles.colorHex}>{customForm.primary}</span>
                </label>
                <div className={styles.pickerRow}>
                  <input
                    type="color"
                    value={customForm.primary}
                    onChange={(e) => setCustomForm({ ...customForm, primary: e.target.value })}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={customForm.primary}
                    onChange={(e) => setCustomForm({ ...customForm, primary: e.target.value })}
                    className={styles.textInput}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span>Secondary Accent (Purple / Violet)</span>
                  <span className={styles.colorHex}>{customForm.secondary}</span>
                </label>
                <div className={styles.pickerRow}>
                  <input
                    type="color"
                    value={customForm.secondary}
                    onChange={(e) => setCustomForm({ ...customForm, secondary: e.target.value })}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={customForm.secondary}
                    onChange={(e) => setCustomForm({ ...customForm, secondary: e.target.value })}
                    className={styles.textInput}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span>Deep Background Color</span>
                  <span className={styles.colorHex}>{customForm.bgPrimary}</span>
                </label>
                <div className={styles.pickerRow}>
                  <input
                    type="color"
                    value={customForm.bgPrimary}
                    onChange={(e) => setCustomForm({ ...customForm, bgPrimary: e.target.value })}
                    className={styles.colorInput}
                  />
                  <input
                    type="text"
                    value={customForm.bgPrimary}
                    onChange={(e) => setCustomForm({ ...customForm, bgPrimary: e.target.value })}
                    className={styles.textInput}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Apply Custom Palette to Live Site
              </button>
            </form>
          </div>

          {/* Live Component Preview Widget */}
          <div className={`glass-card ${styles.previewCard}`}>
            <h2 className={styles.sectionTitle}>4. Real-Time UI Preview</h2>
            <div
              className={styles.previewBox}
              style={{
                backgroundColor: customForm.bgPrimary,
                borderColor: `rgba(${hexToRgb(customForm.primary)}, 0.3)`,
              }}
            >
              <span
                className={styles.previewTag}
                style={{
                  color: customForm.primary,
                  borderColor: `rgba(${hexToRgb(customForm.primary)}, 0.3)`,
                  background: `rgba(${hexToRgb(customForm.primary)}, 0.08)`,
                }}
              >
                &lt;// LIVE PREVIEW /&gt;
              </span>

              <h3
                className={styles.previewHeading}
                style={{
                  background: `linear-gradient(135deg, ${customForm.primary}, ${customForm.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                John Liton Mardy
              </h3>

              <p className={styles.previewText} style={{ color: customForm.textPrimary }}>
                Full-Stack Software Engineer building high-performance modern web and mobile applications.
              </p>

              <div className={styles.previewButtons}>
                <button
                  type="button"
                  className={styles.previewBtnPrimary}
                  style={{
                    background: `linear-gradient(135deg, ${customForm.primary}, ${customForm.secondary})`,
                    boxShadow: `0 0 15px ${customForm.primary}60`,
                  }}
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  className={styles.previewBtnOutline}
                  style={{
                    borderColor: customForm.primary,
                    color: customForm.primary,
                  }}
                >
                  Outline Button
                </button>
              </div>

              {/* Progress Bar Preview */}
              <div className={styles.previewProgressWrapper}>
                <div className={styles.previewProgressLabel}>
                  <span style={{ color: customForm.textPrimary }}>Next.js / React</span>
                  <span style={{ color: customForm.primary }}>95%</span>
                </div>
                <div className={styles.previewProgressBar}>
                  <div
                    className={styles.previewProgressFill}
                    style={{
                      width: '95%',
                      background: `linear-gradient(90deg, ${customForm.primary}, ${customForm.secondary})`,
                      boxShadow: `0 0 10px ${customForm.primary}80`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual FX Toggles */}
      <section className={`glass-card ${styles.fxSection}`}>
        <h2 className={styles.sectionTitle}>5. Visual Effects &amp; Scanlines</h2>
        <div className={styles.togglesGrid}>
          <div className={styles.toggleItem}>
            <div>
              <strong>Retro CRT Scanlines</strong>
              <p>Subtle animated scanlines overlay for cyberpunk feel</p>
            </div>
            <input
              type="checkbox"
              checked={cmsData?.themeConfig?.scanlines ?? true}
              onChange={(e) => updateThemeConfig({ scanlines: e.target.checked })}
              className={styles.checkbox}
            />
          </div>

          <div className={styles.toggleItem}>
            <div>
              <strong>Cyberpunk Grid Lines</strong>
              <p>Perspective grid texture across background</p>
            </div>
            <input
              type="checkbox"
              checked={cmsData?.themeConfig?.showGrid ?? true}
              onChange={(e) => updateThemeConfig({ showGrid: e.target.checked })}
              className={styles.checkbox}
            />
          </div>

          <div className={styles.toggleItem}>
            <div>
              <strong>Interactive Cursor Glow</strong>
              <p>Ambient light following mouse movement</p>
            </div>
            <input
              type="checkbox"
              checked={cmsData?.themeConfig?.cursorGlow ?? true}
              onChange={(e) => updateThemeConfig({ cursorGlow: e.target.checked })}
              className={styles.checkbox}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
