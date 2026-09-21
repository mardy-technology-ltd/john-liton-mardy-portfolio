'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import { formatSocialUrl } from '@/data/cmsData';
import SocialIcon from '@/components/ui/SocialIcon';
import styles from './Contact.module.css';

export default function Contact() {
  const { personalInfo, addMessage } = useCMS();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    
    await new Promise((r) => setTimeout(r, 600));
    if (addMessage) {
      addMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        source: 'contact',
        subject: 'General Contact Message',
      });
    }

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
          {/* Direct Channels Column */}
          <motion.div
            className={styles.infoColumn}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className={styles.infoTitle}>Direct Channels</h3>
            <p className={styles.infoText}>
              Prefer direct outreach? Reach out via email or connect with me across professional networks.
            </p>

            {/* Sleek Social Icon Pills */}
            <div className={styles.socialPills}>
              {(personalInfo?.socialLinks || [
                { id: 's1', platform: 'linkedin', label: 'LinkedIn', url: personalInfo?.linkedin || 'https://linkedin.com', placement: 'both' },
                { id: 's2', platform: 'github', label: 'GitHub', url: personalInfo?.github || 'https://github.com', placement: 'both' },
                { id: 's3', platform: 'email', label: 'Email', url: personalInfo?.email || 'mailto:john.liton.mardy@example.com', placement: 'both' }
              ])
                .filter((item) => item.placement === 'both' || item.placement === 'footer' || !item.placement)
                .map((item) => {
                  const rawUrl = item.url || (item.label?.startsWith('http') ? item.label : '#');
                  const href = formatSocialUrl(rawUrl, item.platform);
                  const isMailto = href.startsWith('mailto:');
                  const isExternal = !isMailto && href !== '#' && (href.startsWith('http://') || href.startsWith('https://'));

                  return (
                    <a
                      key={item.id || item.platform}
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className={styles.socialPill}
                    >
                      <SocialIcon platform={item.platform} size={16} />
                      <span>{item.label || item.platform}</span>
                      <span className={styles.socialArrow}>↗</span>
                    </a>
                  );
                })}
            </div>

            {/* Availability Status Card */}
            <div className={styles.availabilityCard}>
              <span className={styles.availDot} />
              <div className={styles.availText}>
                <strong style={{ color: 'var(--clr-text-primary)' }}>
                  {personalInfo?.availableForWork ? 'Available for New Projects' : 'Inquiries Welcome'}
                </strong>
                <br />
                Response time: typically within 24 hours.
              </div>
            </div>
          </motion.div>

          {/* Message Form Column */}
          <motion.div
            className={styles.formColumn}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className={styles.infoTitle}>Drop me a message</h3>
            <p className={styles.infoText}>
              I&apos;m currently available for freelance projects and full-time opportunities.
              Whether it&apos;s a quick question or a big idea — reach out!
            </p>

            <form
              className={`glass-card ${styles.form}`}
              onSubmit={handleSubmit}
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
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer with Professional Branding & Socials */}
      <footer className={styles.footer}>
        <div className={styles.footerSocials}>
          {(personalInfo?.socialLinks || [
            { id: 'f-linkedin', platform: 'linkedin', label: 'LinkedIn', url: personalInfo?.linkedin || 'https://linkedin.com', placement: 'both' },
            { id: 'f-github', platform: 'github', label: 'GitHub', url: personalInfo?.github || 'https://github.com', placement: 'both' },
            { id: 'f-email', platform: 'email', label: 'Email', url: personalInfo?.email || 'mailto:john.liton.mardy@example.com', placement: 'both' }
          ])
            .filter((s) => s.placement === 'both' || s.placement === 'footer' || !s.placement)
            .map((s) => {
              const rawUrl = s.url || (s.label?.startsWith('http') ? s.label : '#');
              const href = formatSocialUrl(rawUrl, s.platform);
              const isMailto = href.startsWith('mailto:');
              const isExternal = !isMailto && href !== '#' && (href.startsWith('http://') || href.startsWith('https://'));

              return (
                <a
                  key={s.id || s.platform}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={styles.footerSocialLink}
                  title={s.label || s.platform}
                >
                  <SocialIcon platform={s.platform} size={18} />
                </a>
              );
            })}
        </div>

        <div className={styles.footerInfo}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} <span className={styles.brandName}>{personalInfo?.name || 'John Liton Mardy'}</span>. All rights reserved.
          </p>
          <p className={styles.tagline}>
            Engineering Scalable, High-Impact &amp; Mission-Critical Digital Systems.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={styles.backToTop}
          title="Scroll to Top"
        >
          <span>Back to Top ↑</span>
        </button>
      </footer>
    </section>
  );
}
