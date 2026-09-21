'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from './adminDashboard.module.css';

export default function AdminDashboardPage() {
  const { cmsData } = useCMS();

  const skillsCount = cmsData?.skills?.length || 0;
  const projectsCount = cmsData?.projects?.length || 0;
  const blogsCount = cmsData?.blogs?.length || 0;
  const activeTheme = cmsData?.themeConfig?.activeTheme || 'cyberpunk-neon';

  const stats = [
    { label: 'Technical Skills', value: skillsCount, icon: '💡', link: '/admin/skills', color: '#00ffff' },
    { label: 'Featured Projects', value: projectsCount, icon: '🚀', link: '/admin/projects', color: '#a855f7' },
    { label: 'Articles & Blogs', value: blogsCount, icon: '✍️', link: '/admin/blog', color: '#ff6b9d' },
    { label: 'Active Theme', value: activeTheme, icon: '🎨', link: '/admin/theme', color: '#38bdf8' },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Welcome Banner */}
      <motion.div
        className={`glass-card ${styles.welcomeBanner}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.bannerContent}>
          <span className="section-tag">&lt;// SYSTEM: CONTROL PANEL /&gt;</span>
          <h1 className={styles.welcomeTitle}>Portfolio Management Studio</h1>
          <p className={styles.welcomeSubtitle}>
            Welcome back, <strong>{cmsData?.personalInfo?.name || 'John Liton Mardy'}</strong>. Customize every section, create articles, and transform the entire website theme in real-time.
          </p>
        </div>
        <div className={styles.bannerActions}>
          <Link href="/admin/theme" className="btn btn-primary">
            <span>🎨 Customize Theme</span>
          </Link>
          <Link href="/" target="_blank" className="btn btn-outline">
            <span>View Live Site ↗</span>
          </Link>
        </div>
      </motion.div>

      {/* Metric Cards Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={`glass-card ${styles.statCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className={styles.statHeader}>
              <span className={styles.statIcon} style={{ background: `${stat.color}15`, borderColor: `${stat.color}40` }}>
                {stat.icon}
              </span>
              <Link href={stat.link} className={styles.statLink}>
                Manage →
              </Link>
            </div>
            <div className={styles.statValue} style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Launchpad & Section Status */}
      <div className={styles.sectionsRow}>
        {/* Quick Launchpad */}
        <div className={`glass-card ${styles.launchCard}`}>
          <h2 className={styles.cardHeading}>🚀 Quick Customizers</h2>
          <div className={styles.quickGrid}>
            <Link href="/admin/hero" className={styles.quickBtn}>
              <span className={styles.quickIcon}>👤</span>
              <div>
                <strong>Hero &amp; Profile</strong>
                <p>Edit name, title, bio, and social links</p>
              </div>
            </Link>
            <Link href="/admin/skills" className={styles.quickBtn}>
              <span className={styles.quickIcon}>💡</span>
              <div>
                <strong>Skills Arsenal</strong>
                <p>Add/Edit/Delete web &amp; mobile skills</p>
              </div>
            </Link>
            <Link href="/admin/projects" className={styles.quickBtn}>
              <span className={styles.quickIcon}>💻</span>
              <div>
                <strong>Projects Showcase</strong>
                <p>Update live links, GitHub repos &amp; tags</p>
              </div>
            </Link>
            <Link href="/admin/blog" className={styles.quickBtn}>
              <span className={styles.quickIcon}>📝</span>
              <div>
                <strong>Write New Article</strong>
                <p>Create technical posts with rich markdown</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Section Visibility Summary */}
        <div className={`glass-card ${styles.visibilityCard}`}>
          <div className={styles.visHeader}>
            <h2 className={styles.cardHeading}>⚙️ Section Visibility</h2>
            <Link href="/admin/settings" className={styles.editVisLink}>
              Edit Toggles →
            </Link>
          </div>
          <div className={styles.visList}>
            {Object.entries(cmsData?.sectionVisibility || {}).map(([key, isVisible]) => (
              <div key={key} className={styles.visItem}>
                <span className={styles.visName}>{key.toUpperCase()}</span>
                <span className={`${styles.visBadge} ${isVisible ? styles.visActive : styles.visInactive}`}>
                  {isVisible ? '● Active' : '○ Hidden'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
