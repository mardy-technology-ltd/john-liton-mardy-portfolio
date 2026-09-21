'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/context/CMSContext';
import styles from './adminLayout.module.css';

const navItems = [
  { label: 'Overview', href: '/admin', icon: '📊' },
  { label: 'Inbox & Leads', href: '/admin/messages', icon: '📬' },
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
  const { cmsData, resetToDefaults, unreadMessagesCount } = useCMS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Mobile Drawer */}
      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoBadge}>
            <span className={styles.bracket}>&lt;</span>
            <span className={styles.logoText}>JLM STUDIO</span>
            <span className={styles.bracket}>/&gt;</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem' }}>
            <p className={styles.sidebarSub}>Dynamic Portfolio CMS</p>
            {/* Close button on mobile drawer */}
            <button
              type="button"
              className={styles.closeDrawerBtn}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
                {item.href === '/admin/messages' && unreadMessagesCount > 0 && (
                  <span
                    style={{
                      background: 'rgba(0, 255, 255, 0.2)',
                      color: 'var(--clr-cyan)',
                      border: '1px solid rgba(0, 255, 255, 0.4)',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 'bold',
                    }}
                  >
                    {unreadMessagesCount}
                  </span>
                )}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Hamburger for mobile */}
            <button
              type="button"
              className={styles.mobileToggleBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
            </button>

            <div className={styles.breadcrumbs}>
              <span className={styles.crumbRoot}>CMS Admin</span>
              <span className={styles.crumbDivider}>/</span>
              <span className={styles.crumbCurrent}>
                {navItems.find((n) => n.href === pathname)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Link
              href="/"
              target="_blank"
              className="btn btn-outline"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              <span>View Site ↗</span>
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
