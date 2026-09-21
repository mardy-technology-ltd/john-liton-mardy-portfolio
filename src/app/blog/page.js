'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBlogs, getAllTags } from '@/data/blogs';
import styles from './blogList.module.css';

export default function BlogListPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const allBlogs = getAllBlogs();
  const allTags = getAllTags();

  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((post) => {
      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTag && matchesSearch;
    });
  }, [allBlogs, selectedTag, searchQuery]);

  return (
    <div className={styles.pageWrapper}>
      {/* Background Ambience */}
      <div className="scanline" />
      <div className="bg-grid" />

      {/* Top Navigation Bar */}
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.backButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Portfolio</span>
          </Link>

          <div className={styles.brandTitle}>
            <span className={styles.brandBracket}>&lt;</span>
            <span className={styles.brandName}>JOHN LITON MARDY</span>
            <span className={styles.brandBracket}>/&gt;</span>
          </div>

          <Link href="/#contact" className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
            Contact
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container ${styles.main}`}>
        {/* Hero Banner */}
        <motion.div
          className={styles.heroBanner}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">&lt;// TECHNICAL ARTICLES &amp; KNOWLEDGE BASE /&gt;</span>
          <h1 className={styles.mainTitle}>Articles &amp; Insights</h1>
          <p className={styles.mainSubtitle}>
            Practical guides, deep-dives into modern web architectures, 3D WebGL implementations, and backend engineering patterns.
          </p>
        </motion.div>

        {/* Controls: Search & Tags */}
        <div className={styles.controls}>
          {/* Search Bar */}
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by keyword, topic or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tag Filter Pills */}
          <div className={styles.tagFilters}>
            {allTags.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  className={`${styles.tagPill} ${isActive ? styles.activeTag : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blog Post Grid */}
        <AnimatePresence mode="popLayout">
          {filteredBlogs.length > 0 ? (
            <motion.div layout className={styles.grid}>
              {filteredBlogs.map((post, idx) => (
                <motion.article
                  layout
                  key={post.slug}
                  className={`glass-card ${styles.card}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <div className={styles.accentLine} />

                  {/* Cover Image Thumbnail */}
                  {post.coverImage && (
                    <Link href={`/blog/${post.slug}`} className={styles.imageLink}>
                      <div className={styles.imageWrapper}>
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          width={600}
                          height={340}
                          className={styles.coverImage}
                        />
                      </div>
                    </Link>
                  )}

                  <div className={styles.meta}>
                    <span className={styles.date}>{post.publishedAt}</span>
                    <span className={styles.metaDot}>•</span>
                    <span className={styles.readTime}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className={styles.cardTitle}>
                    <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className={styles.excerpt}>{post.excerpt}</p>

                  <div className={styles.tags}>
                    {post.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className={styles.cardFooter}>
                    <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                      <span>Read Full Article</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className={styles.noResults}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No articles found matching &quot;{searchQuery}&quot;.</p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSelectedTag('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
