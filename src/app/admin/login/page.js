'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './login.module.css';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and security password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Authorization denied. Invalid security credentials.');
        setLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setLoading(false);

      // Brief visual laser unlock animation before routing
      setTimeout(() => {
        router.push(from);
        router.refresh();
      }, 700);
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Network or server connection failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.terminalCard}
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Corner Tech Brackets */}
      <div className={styles.bracketTL} />
      <div className={styles.bracketTR} />
      <div className={styles.bracketBL} />
      <div className={styles.bracketBR} />

      {/* Laser Unlock Flash */}
      {success && <div className={styles.laserUnlock} />}

      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.logoBadge}>
          <span className={styles.bracket}>&lt;</span>
          <span className={styles.logoText}>JLM CMS</span>
          <span className={styles.bracket}>/&gt;</span>
        </div>
        <h1 className={styles.title}>Admin Authorization</h1>
        <p className={styles.subtitle}>
          Enter your security credentials to access the portfolio studio.
        </p>
      </div>

      {/* Security Status Bar */}
      <div className={styles.statusBar}>
        <span className={styles.statusLabel}>PROTOCOL: TLS 1.3 / HMAC-256</span>
        <span className={styles.statusValue}>
          <span
            className={styles.statusDot}
            style={{
              backgroundColor: error ? '#ff0055' : success ? '#00ff66' : 'var(--clr-cyan)',
              boxShadow: error
                ? '0 0 8px #ff0055'
                : success
                ? '0 0 8px #00ff66'
                : '0 0 8px var(--clr-cyan)',
            }}
          />
          {loading ? 'VERIFYING...' : success ? 'ACCESS GRANTED' : error ? 'SECURITY ALERT' : 'SYSTEM READY'}
        </span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Error Alert */}
        {error && (
          <motion.div
            className={styles.errorAlert}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </motion.div>
        )}

        {/* Success Alert */}
        {success && (
          <motion.div
            className={styles.successAlert}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>🔓</span>
            <span>Security clearance verified. Unlocking dashboard...</span>
          </motion.div>
        )}

        {/* Email / Username Field */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <span>👤</span> Admin Identity / Email
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>@</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@johnlitonmardy.com"
              className={styles.input}
              autoComplete="email"
              required
              disabled={loading || success}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <span>🔑</span> Security Password
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={styles.input}
              autoComplete="current-password"
              required
              disabled={loading || success}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePasswordBtn}
              title={showPassword ? 'Hide Password' : 'Show Password'}
              tabIndex={-1}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading || success}
        >
          {loading ? (
            <>
              <span className={styles.spinner} />
              <span>Authenticating...</span>
            </>
          ) : success ? (
            <span>✓ Access Granted</span>
          ) : (
            <>
              <span>⚡</span>
              <span>Authorize Access</span>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className={styles.cardFooter}>
        <Link href="/" className={styles.backLink}>
          <span>←</span>
          <span>Return to Portfolio</span>
        </Link>
        <span className={styles.securityNote}>🔒 End-to-End Encrypted</span>
      </div>
    </motion.div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className={styles.loginWrapper}>
      {/* Background Ambient Orbs & Scanline */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className="scanline" />
      <div className="bg-grid" />

      <Suspense fallback={<div style={{ color: 'var(--clr-cyan)', fontFamily: 'var(--font-mono)' }}>Loading Security Terminal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}

