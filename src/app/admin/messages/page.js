'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from './adminMessages.module.css';

export default function AdminMessagesPage() {
  const { messages, deleteMessage, updateMessageStatus, personalInfo } = useCMS();
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'hire' | 'contact'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'read' | 'replied'
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const messageList = messages || [];

  // Filter messages by category, status tab, and search query
  const filteredMessages = messageList.filter((m) => {
    // 1. Category Filter (Hire vs Contact vs All)
    const isHire = m.source === 'hire' || Boolean(m.projectType);
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'hire'
        ? isHire
        : !isHire;

    // 2. Status Tab Filter
    const matchesTab =
      activeTab === 'all' ? true : m.status === activeTab;

    // 3. Search Query Filter
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.projectType && m.projectType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesTab && matchesSearch;
  });

  const totalCount = messageList.length;
  const hireCount = messageList.filter((m) => m.source === 'hire' || Boolean(m.projectType)).length;
  const contactCount = messageList.filter((m) => m.source === 'contact' || (!m.source && !m.projectType)).length;
  const unreadCount = messageList.filter((m) => m.status === 'unread').length;
  const repliedCount = messageList.filter((m) => m.status === 'replied').length;

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    showToast(`✓ Copied email: ${email}`);
  };

  const handleReplyEmail = (msg) => {
    const isHire = msg.source === 'hire' || Boolean(msg.projectType);
    
    let subject = '';
    let body = '';

    if (isHire) {
      subject = encodeURIComponent(`Re: Your Project Proposal [${msg.projectType || 'Project Inquiry'}] — ${personalInfo?.name || 'John Liton Mardy'}`);
      body = encodeURIComponent(
        `Hi ${msg.name},\n\nThank you for reaching out regarding your project proposal "${msg.projectType || 'Project'}"!\n\nI reviewed your brief:\n- Project Type: ${msg.projectType || 'Custom Project'}\n- Budget Range: ${msg.budget || 'To be discussed'}\n- Timeline: ${msg.timeline || 'Flexible'}\n\nClient Details & Notes:\n"${msg.message}"\n\n[Write your reply / schedule a discovery call here]\n\nBest regards,\n${personalInfo?.name || 'John Liton Mardy'}\n${personalInfo?.title || 'Software Engineer'}`
      );
    } else {
      subject = encodeURIComponent(`Re: Inquiry from Portfolio — ${personalInfo?.name || 'John Liton Mardy'}`);
      body = encodeURIComponent(
        `Hi ${msg.name},\n\nThank you for reaching out through my portfolio website!\n\nRegarding your message:\n"${msg.message}"\n\n[Write your reply here]\n\nBest regards,\n${personalInfo?.name || 'John Liton Mardy'}\n${personalInfo?.title || 'Software Engineer'}`
      );
    }

    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
    updateMessageStatus(msg.id, 'replied');
    showToast(`✓ Opened email client to reply to ${msg.name}`);
  };

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    updateMessageStatus(id, nextStatus);
    showToast(`✓ Message marked as ${nextStatus}`);
  };

  const handleDelete = (id, senderName) => {
    if (window.confirm(`Delete message from "${senderName}"?`)) {
      deleteMessage(id);
      showToast(`✓ Message from ${senderName} deleted`);
    }
  };

  const handleMarkAllRead = () => {
    messageList.forEach((m) => {
      if (m.status === 'unread') {
        updateMessageStatus(m.id, 'read');
      }
    });
    showToast('✓ All messages marked as read');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className={styles.container}>
      {toast && (
        <motion.div
          className={styles.toast}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {toast}
        </motion.div>
      )}

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <span className="section-tag">INBOX &amp; LEADS</span>
          <h1 className={styles.title}>Client Inquiries &amp; Proposals</h1>
          <p className={styles.subtitle}>
            Manage hire proposals and general contact messages sent directly from your live portfolio website.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            ✓ Mark All as Read
          </button>
        )}
      </div>

      {/* Category Switcher Tabs */}
      <div className={styles.categorySwitcher}>
        <button
          type="button"
          onClick={() => setActiveCategory('hire')}
          className={`${styles.categoryBtn} ${activeCategory === 'hire' ? styles.categoryBtnActive : ''}`}
        >
          <div className={styles.categoryLeft}>
            <span className={styles.categoryIcon}>💼</span>
            <div>
              <div className={styles.categoryTitle}>Hire Proposals</div>
              <div className={styles.categorySub}>Submitted from Hire Me modal</div>
            </div>
          </div>
          <span className={`${styles.categoryCount} ${activeCategory === 'hire' ? styles.categoryCountActive : ''}`}>
            {hireCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('contact')}
          className={`${styles.categoryBtn} ${activeCategory === 'contact' ? styles.categoryBtnActive : ''}`}
        >
          <div className={styles.categoryLeft}>
            <span className={styles.categoryIcon}>✉️</span>
            <div>
              <div className={styles.categoryTitle}>Contact Messages</div>
              <div className={styles.categorySub}>Submitted from Contact form</div>
            </div>
          </div>
          <span className={`${styles.categoryCount} ${activeCategory === 'contact' ? styles.categoryCountActive : ''}`}>
            {contactCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`${styles.categoryBtn} ${activeCategory === 'all' ? styles.categoryBtnActive : ''}`}
        >
          <div className={styles.categoryLeft}>
            <span className={styles.categoryIcon}>📁</span>
            <div>
              <div className={styles.categoryTitle}>All Inquiries</div>
              <div className={styles.categorySub}>Combined inbox stream</div>
            </div>
          </div>
          <span className={`${styles.categoryCount} ${activeCategory === 'all' ? styles.categoryCountActive : ''}`}>
            {totalCount}
          </span>
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        {/* Search */}
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search inquiries by name, email, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className={styles.filterTabs}>
          {[
            { id: 'all', label: 'All Status' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'read', label: 'Read' },
            { id: 'replied', label: `Replied (${repliedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className={styles.messagesList}>
        <AnimatePresence>
          {filteredMessages.map((msg) => {
            const isUnread = msg.status === 'unread';
            const isReplied = msg.status === 'replied';
            const isHire = msg.source === 'hire' || Boolean(msg.projectType);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className={`${styles.messageCard} ${isUnread ? styles.unreadCard : ''}`}
              >
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.senderProfile}>
                    <div className={styles.avatar}>{getInitials(msg.name)}</div>
                    <div>
                      <h3 className={styles.senderName}>{msg.name}</h3>
                      <div className={styles.senderEmail}>
                        <span>{msg.email}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(msg.email)}
                          className={styles.copyBtn}
                          title="Copy email address"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardMeta}>
                    <span className={styles.dateBadge} suppressHydrationWarning>
                      {formatDate(msg.date)}
                    </span>
                    <span
                      className={`${styles.typeBadge} ${
                        isHire ? styles.typeHire : styles.typeContact
                      }`}
                    >
                      {isHire ? '💼 Hire Proposal' : '✉️ Contact Msg'}
                    </span>
                    <span
                      className={`${styles.statusBadge} ${
                        isUnread
                          ? styles.statusUnread
                          : isReplied
                          ? styles.statusReplied
                          : styles.statusRead
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                </div>

                {/* If Hire Inquiry -> Show Proposal Specification Chips */}
                {isHire && (
                  <div className={styles.proposalSpecs}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>🎯 Project Type</span>
                      <span className={styles.specValue}>{msg.projectType || 'Custom Project'}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>💰 Budget Range</span>
                      <span className={styles.specValue} style={{ color: 'var(--clr-cyan)' }}>
                        {msg.budget || 'To be discussed'}
                      </span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>⏱️ Desired Timeline</span>
                      <span className={styles.specValue}>{msg.timeline || 'Flexible'}</span>
                    </div>
                  </div>
                )}

                {/* Message Body */}
                <div className={styles.messageBody}>{msg.message}</div>

                {/* Actions Footer */}
                <div className={styles.cardActions}>
                  <div className={styles.actionLeft}>
                    {/* 1-Click Reply via Email */}
                    <button
                      type="button"
                      onClick={() => handleReplyEmail(msg)}
                      className={styles.replyBtn}
                      title="Open default email app to compose reply"
                    >
                      <span>✉️ Reply via Email</span>
                    </button>

                    {/* Toggle Read/Unread */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(msg.id, msg.status)}
                      className={styles.ghostBtn}
                    >
                      {isUnread ? '✓ Mark Read' : '✉️ Mark Unread'}
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(msg.id, msg.name)}
                    className={styles.deleteBtn}
                    title="Delete message"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredMessages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--clr-text-primary)', marginBottom: '0.4rem' }}>
              No Inquiries Found
            </h3>
            <p style={{ fontSize: '0.88rem' }}>
              {searchQuery
                ? `No inquiries matching "${searchQuery}". Try a different keyword.`
                : activeCategory === 'hire'
                ? 'No Hire Proposals yet. Client submissions from the "HIRE ME" modal will appear here.'
                : activeCategory === 'contact'
                ? 'No Contact Messages yet. Messages sent from the Contact form will appear here.'
                : 'Your inbox is clear. Messages submitted through your portfolio will show up here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

