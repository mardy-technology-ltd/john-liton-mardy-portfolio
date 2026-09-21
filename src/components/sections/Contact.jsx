'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { personalInfo } from '@/data/portfolio';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate sending (wire up to an API later)
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('sent');
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className={`orb orb-cyan ${styles.orb1}`} style={{ width: 300, height: 300 }} />
      <div className={`orb orb-purple ${styles.orb2}`} style={{ width: 250, height: 250 }} />

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Let&apos;s Work Together</h2>
          <p className="section-subtitle">
            Have a project in mind or just want to say hi? My inbox is always open.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {/* Contact Info */}
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className={styles.infoTitle}>Drop me a message</h3>
            <p className={styles.infoText}>
              I&apos;m currently available for freelance projects and full-time opportunities.
              Whether it&apos;s a quick question or a big idea — reach out!
            </p>

            <div className={styles.contactItems}>
              <a href={`mailto:${personalInfo.email}`} className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className={styles.contactLabel}>Email</p>
                  <p className={styles.contactValue}>{personalInfo.email}</p>
                </div>
              </a>

              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <p className={styles.contactLabel}>LinkedIn</p>
                  <p className={styles.contactValue}>John Liton Mardy</p>
                </div>
              </a>

              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <p className={styles.contactLabel}>GitHub</p>
                  <p className={styles.contactValue}>@johnlitonmardy</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className={`glass-card ${styles.form}`}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="name">Your Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className={styles.input}
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={status === 'sending'}
            >
              {status === 'sending' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'rotate 1s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              )}
              {status === 'idle' && 'Send Message'}
              {status === 'sending' && 'Sending...'}
              {status === 'sent' && '✓ Message Sent!'}
              {status === 'error' && 'Try Again'}
            </button>

            {status === 'sent' && (
              <motion.p
                className={styles.successMsg}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                🚀 Thanks! I&apos;ll get back to you soon.
              </motion.p>
            )}
          </motion.form>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>© {new Date().getFullYear()} John Liton Mardy. Built with Next.js & Three.js</p>
        <p className={styles.footerHeart}>Made with ❤️ in Bangladesh</p>
      </div>
    </section>
  );
}
