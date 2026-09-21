'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from './HireModal.module.css';

const projectTypes = [
  'Full-Stack Web App',
  'Mobile App (React Native)',
  '3D Interactive Website',
  'Full-Time Role',
  'Consulting & Architecture',
  'Contract / Freelance',
  'Other / Custom',
];

const budgetRanges = [
  '< $1,000',
  '$1,000 - $3,000',
  '$3,000 - $8,000',
  '$8,000 - $15,000+',
  'Negotiable / Salary',
];

const timelineOptions = [
  'Immediate (1-2 Weeks)',
  'Within 1 Month',
  '2-3 Months',
  'Flexible / Ongoing',
];

export default function HireModal({ isOpen, onClose }) {
  const { addMessage, personalInfo } = useCMS();

  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: 'Full-Stack Web App',
    budget: '$1,000 - $3,000',
    timeline: 'Within 1 Month',
    message: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setStatus('submitting');
    await new Promise((r) => setTimeout(r, 700));

    if (addMessage) {
      addMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        source: 'hire',
        projectType: form.projectType,
        budget: form.budget,
        timeline: form.timeline,
        subject: `[Hire Proposal: ${form.projectType}] ${form.budget}`,
        message: form.message.trim() || 'No additional note provided.',
      });
    }

    setStatus('success');
  };

  const handleResetAndClose = () => {
    setStatus('idle');
    setForm({
      name: '',
      email: '',
      projectType: 'Full-Stack Web App',
      budget: '$1,000 - $3,000',
      timeline: 'Within 1 Month',
      message: '',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={handleResetAndClose}>
          <motion.div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {status === 'success' ? (
              /* Success State */
              <div className={styles.successState}>
                <div className={styles.successIcon}>🚀</div>
                <h3 className={styles.successTitle}>Inquiry Sent Successfully!</h3>
                <p className={styles.successText}>
                  Thank you, <strong>{form.name}</strong>! Your project inquiry has been delivered directly to my CMS Inbox. I&apos;ll review the requirements and reach out to you at <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem', padding: '0.75rem 2.5rem' }}
                >
                  Done &amp; Close
                </button>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className={styles.header}>
                  <div>
                    <div className={styles.statusBadge}>
                      <span className={styles.statusDot} />
                      <span>{personalInfo?.availableForWork ? 'Available for Work' : 'Inquiry Form'}</span>
                    </div>
                    <h2 className={styles.title}>Start a Project / Hire Me</h2>
                    <p className={styles.subtitle}>
                      Tell me about your vision or role. Let&apos;s build high-performance digital experiences together.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className={styles.closeBtn}
                    aria-label="Close Modal"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className={styles.body}>
                  {/* Name & Email */}
                  <div className={styles.formGrid2}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe / Alex Rivera"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Engagement / Project Type</label>
                    <div className={styles.pillsGrid}>
                      {projectTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setForm({ ...form, projectType: type })}
                          className={`${styles.pillBtn} ${
                            form.projectType === type ? styles.pillActive : ''
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Estimated Budget (USD)</label>
                    <div className={styles.pillsGrid}>
                      {budgetRanges.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setForm({ ...form, budget: b })}
                          className={`${styles.pillBtn} ${
                            form.budget === b ? styles.pillActive : ''
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Desired Timeline</label>
                    <div className={styles.pillsGrid}>
                      {timelineOptions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm({ ...form, timeline: t })}
                          className={`${styles.pillBtn} ${
                            form.timeline === t ? styles.pillActive : ''
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Project Details / Scope</label>
                    <textarea
                      rows={3}
                      placeholder="Share a brief overview of what you're building, key features, or tech stack requirements..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={styles.textarea}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? (
                      <span>Sending Proposal...</span>
                    ) : (
                      <span>🚀 Submit Project Inquiry</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
