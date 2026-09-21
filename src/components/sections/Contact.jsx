'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import SocialIcon from '@/components/ui/SocialIcon';
import styles from './Contact.module.css';

export default function Contact() {
  const { personalInfo } = useCMS();
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
              {(personalInfo?.socialLinks || [
                { id: 's1', platform: 'email', label: 'Email', url: personalInfo?.email || 'mailto:john.liton.mardy@example.com' },
                { id: 's2', platform: 'linkedin', label: 'LinkedIn', url: personalInfo?.linkedin || 'https://linkedin.com' },
                { id: 's3', platform: 'github', label: 'GitHub', url: personalInfo?.github || 'https://github.com' }
              ]).map((item) => {
                const rawUrl = item.url || '#';
                const isEmail = item.platform === 'email' || (rawUrl.includes('@') && !rawUrl.startsWith('http') && !rawUrl.startsWith('mailto:'));
                const href = isEmail && !rawUrl.startsWith('mailto:') ? `mailto:${rawUrl}` : rawUrl;
                const isMailto = href.startsWith('mailto:');
                const displayVal = rawUrl.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '');

                return (
                  <a
                    key={item.id || item.platform}
                    href={href}
                    target={isMailto ? undefined : '_blank'}
                    rel={isMailto ? undefined : 'noopener noreferrer'}
                    className={styles.contactItem}
                  >
                    <div className={styles.contactIcon}>
                      <SocialIcon platform={item.platform} size={18} />
                    </div>
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <p className={styles.contactLabel}>{item.label || item.platform}</p>
                      <p className={styles.contactValue} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {displayVal}
                      </p>
                    </div>
                  </a>
                );
              })}
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
        <p>© {new Date().getFullYear()} {personalInfo?.name || 'John Liton Mardy'}. Built with Next.js & Three.js</p>
        <p className={styles.footerHeart}>Made with ❤️ in Bangladesh</p>
      </div>
    </section>
  );
}
