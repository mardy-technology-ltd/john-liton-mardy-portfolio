'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/context/CMSContext';
import styles from './adminLayout.module.css';

const navItems = [
  { label: 'Overview', href: '/admin', icon: '📊' },
  { label: 'Theme Studio', href: '/admin/theme', icon: '🎨' },
  { label: 'Hero & Profile', href: '/admin/hero', icon: '👤' },
  { label: 'About & Stats', href: '/admin/about', icon: '📄' },
  { label: 'Skills Arsenal', href: '/admin/skills', icon: '💡' },
  { label: 'Projects Manager', href: '/admin/projects', icon: '🚀' },
  { label: 'Experience Timeline', href: '/admin/experience', icon: '💼' },
  { label: 'Articles & Blog', href: '/admin/blog', icon: '✍️' },
  { label: 'Section Visibility', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { cmsData, resetToDefaults } = useCMS();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all site customizations to defaults?')) {
      resetToDefaults();
      alert('All portfolio content & theme settings reset to default.');
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Background Ambience */}
      <div className="scanline" />
      <div className="bg-grid" />

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoBadge}>
            <span className={styles.bracket}>&lt;</span>
            <span className={styles.logoText}>JLM STUDIO</span>
            <span className={styles.bracket}>/&gt;</span>
          </div>
          <p className={styles.sidebarSub}>Dynamic Portfolio CMS</p>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
                {isActive && <span className={styles.activePill} />}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.statusIndicator}>
            <span className={styles.pulseDot} />
            <span>Theme: <strong>{cmsData?.themeConfig?.activeTheme || 'Default'}</strong></span>
          </div>
          <button onClick={handleReset} className={styles.resetBtn} title="Reset all changes to factory defaults">
            Reset to Defaults
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.contentArea}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.breadcrumbs}>
            <span>CMS Admin</span>
            <span className={styles.crumbDivider}>/</span>
            <span className={styles.crumbCurrent}>
              {navItems.find((n) => n.href === pathname)?.label || 'Dashboard'}
            </span>
          </div>

          <div className={styles.headerActions}>
            <Link href="/" target="_blank" className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
              <span>View Live Portfolio ↗</span>
            </Link>
          </div>
        </header>

        {/* Page View */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
