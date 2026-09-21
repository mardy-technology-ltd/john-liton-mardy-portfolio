'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  const router = useRouter();
  const { cmsData, resetToDefaults, unreadMessagesCount } = useCMS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Custom Modal States
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If on login page, render clean standalone layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setShowLogoutModal(false);
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
      setShowLogoutModal(false);
      router.push('/admin/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleResetConfirm = () => {
    resetToDefaults();
    setShowResetModal(false);
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
          
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className={styles.resetBtn}
              style={{ flex: 1, padding: '0.45rem 0.6rem', fontSize: '0.75rem' }}
              title="Reset all changes to factory defaults"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              disabled={loggingOut}
              className="btn btn-outline"
              style={{
                flex: 1,
                padding: '0.45rem 0.6rem',
                fontSize: '0.75rem',
                borderColor: 'rgba(255, 0, 85, 0.4)',
                color: '#ff5577',
              }}
              title="Logout from CMS"
            >
              🚪 Logout
            </button>
          </div>
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

          <div className={styles.headerActions} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--clr-cyan)',
                background: 'rgba(0, 255, 255, 0.08)',
                border: '1px solid rgba(0, 255, 255, 0.25)',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 6px #00ff66' }} />
              Authorized
            </span>

            <Link
              href="/"
              target="_blank"
              className="btn btn-outline"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              <span>View Site ↗</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              disabled={loggingOut}
              className="btn btn-outline"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                borderColor: 'rgba(255, 0, 85, 0.35)',
                color: '#ff5577',
              }}
              title="Logout from Admin"
            >
              <span>🚪 Logout</span>
            </button>
          </div>
        </header>

        {/* Page View */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>

      {/* ============================================================
          1. CUSTOM CYBERPUNK LOGOUT CONFIRMATION MODAL
          ============================================================ */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className={styles.modalOverlay} onClick={() => !loggingOut && setShowLogoutModal(false)}>
            <motion.div
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Corner Tech Brackets */}
              <div style={{ position: 'absolute', top: -2, left: -2, width: 16, height: 16, borderTop: '3px solid #ff0055', borderLeft: '3px solid #ff0055' }} />
              <div style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderTop: '3px solid var(--clr-purple)', borderRight: '3px solid var(--clr-purple)' }} />
              <div style={{ position: 'absolute', bottom: -2, left: -2, width: 16, height: 16, borderBottom: '3px solid var(--clr-purple)', borderLeft: '3px solid var(--clr-purple)' }} />
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderBottom: '3px solid #ff0055', borderRight: '3px solid #ff0055' }} />

              <div className={styles.modalIconWrapper}>
                <span>🚪</span>
              </div>

              <h2 className={styles.modalTitle}>Terminate Session?</h2>
              <p className={styles.modalDesc}>
                Are you sure you want to end your current admin session? You will be signed out and need your security credentials to re-enter.
              </p>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={() => setShowLogoutModal(false)}
                  className={styles.modalCancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={handleLogoutConfirm}
                  className={styles.modalConfirmBtn}
                >
                  {loggingOut ? 'Signing out...' : '✓ Yes, Logout'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          2. CUSTOM CYBERPUNK RESET DEFAULTS MODAL
          ============================================================ */}
      <AnimatePresence>
        {showResetModal && (
          <div className={styles.modalOverlay} onClick={() => setShowResetModal(false)}>
            <motion.div
              className={`${styles.modalCard} ${styles.modalCardReset}`}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Corner Tech Brackets */}
              <div style={{ position: 'absolute', top: -2, left: -2, width: 16, height: 16, borderTop: '3px solid var(--clr-cyan)', borderLeft: '3px solid var(--clr-cyan)' }} />
              <div style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderTop: '3px solid var(--clr-purple)', borderRight: '3px solid var(--clr-purple)' }} />
              <div style={{ position: 'absolute', bottom: -2, left: -2, width: 16, height: 16, borderBottom: '3px solid var(--clr-purple)', borderLeft: '3px solid var(--clr-purple)' }} />
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderBottom: '3px solid var(--clr-cyan)', borderRight: '3px solid var(--clr-cyan)' }} />

              <div className={`${styles.modalIconWrapper} ${styles.modalIconWrapperReset}`}>
                <span>⚡</span>
              </div>

              <h2 className={styles.modalTitle} style={{ color: 'var(--clr-cyan)' }}>Reset To Defaults?</h2>
              <p className={styles.modalDesc}>
                This will reset all portfolio CMS customizations, active theme colors, and section settings back to their factory defaults.
              </p>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className={styles.modalCancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetConfirm}
                  className={`${styles.modalConfirmBtn} ${styles.modalConfirmBtnReset}`}
                >
                  ✓ Reset All Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
