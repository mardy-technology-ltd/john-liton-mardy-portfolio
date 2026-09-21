'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from './adminMessages.module.css';

export default function AdminMessagesPage() {
  const { messages, deleteMessage, updateMessageStatus, personalInfo } = useCMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'read' | 'replied'
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const messageList = messages || [];

  // Filter messages
  const filteredMessages = messageList.filter((m) => {
    const matchesTab =
      activeTab === 'all' ? true : m.status === activeTab;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const totalCount = messageList.length;
  const unreadCount = messageList.filter((m) => m.status === 'unread').length;
  const repliedCount = messageList.filter((m) => m.status === 'replied').length;

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    showToast(`✓ Copied email: ${email}`);
  };

  const handleReplyEmail = (msg) => {
    const subject = encodeURIComponent(`Re: Inquiry from Portfolio — ${personalInfo?.name || 'John Liton Mardy'}`);
    const body = encodeURIComponent(
      `Hi ${msg.name},\n\nThank you for reaching out through my portfolio website!\n\nRegarding your message:\n"${msg.message}"\n\n[Write your reply here]\n\nBest regards,\n${personalInfo?.name || 'John Liton Mardy'}\n${personalInfo?.title || 'Software Engineer'}`
    );
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
          <h1 className={styles.title}>Client Inquiries &amp; Messages</h1>
          <p className={styles.subtitle}>
            Read contact inquiries sent directly from your live portfolio website and reply in 1-click via email.
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

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--clr-cyan)' }}>
            📬
          </div>
          <div>
            <div className={styles.statNumber}>{totalCount}</div>
            <div className={styles.statLabel}>Total Inquiries</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#00ffff' }}>
            ⚡
          </div>
          <div>
            <div className={styles.statNumber} style={{ color: unreadCount > 0 ? 'var(--clr-cyan)' : 'inherit' }}>
              {unreadCount}
            </div>
            <div className={styles.statLabel}>Unread Messages</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#34d399' }}>
            ✉️
          </div>
          <div>
            <div className={styles.statNumber} style={{ color: '#34d399' }}>
              {repliedCount}
            </div>
            <div className={styles.statLabel}>Replied Leads</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        {/* Search */}
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search messages by name, email, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {[
            { id: 'all', label: `All (${totalCount})` },
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
                    <span className={styles.dateBadge}>{formatDate(msg.date)}</span>
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
              No Messages Found
            </h3>
            <p style={{ fontSize: '0.88rem' }}>
              {searchQuery
                ? `No inquiries matching "${searchQuery}". Try a different keyword.`
                : 'Your inbox is clear. Messages submitted through your contact form will show up here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
