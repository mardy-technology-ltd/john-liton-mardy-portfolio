'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './blogPost.module.css';

export default function ArticleClient({ post, relatedPosts }) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  const handleSharePlatform = (platform) => {
    if (typeof window === 'undefined') return;
    const currentUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(post.title);

    let targetUrl = '';
    if (platform === 'linkedin') {
      targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
    } else if (platform === 'twitter') {
      targetUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareTitle}`;
    } else if (platform === 'facebook') {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Background Ambience */}
      <div className="scanline" />
      <div className="bg-grid" />

      {/* Top Navigation */}
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/blog" className={styles.backButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>All Articles</span>
          </Link>

          <Link href="/" className={styles.brandTitle}>
            <span className={styles.brandBracket}>&lt;</span>
            <span className={styles.brandName}>JOHN LITON MARDY</span>
            <span className={styles.brandBracket}>/&gt;</span>
          </Link>

          <Link href="/#contact" className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
            Get in Touch
          </Link>
        </div>
      </header>

      {/* Main Article Container */}
      <main className={`container ${styles.articleContainer}`}>
        <article className={styles.article}>
          {/* Post Header */}
          <motion.div
            className={styles.articleHeader}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tags */}
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className={styles.title}>{post.title}</h1>

            {/* Meta Row: Author, Date, Read Time */}
            <div className={styles.metaRow}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <Image
                    src={post.author.avatar || '/profile.jpg'}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className={styles.authorAvatarImg}
                  />
                </div>
                <div>
                  <div className={styles.authorName}>{post.author.name}</div>
                  <div className={styles.authorRole}>{post.author.role}</div>
                </div>
              </div>

              <div className={styles.dateAndRead}>
                <span>{post.publishedAt}</span>
                <span>•</span>
                <span className={styles.readTime}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {post.readTime}
                </span>
              </div>
            </div>

            {/* Cover Banner Image */}
            {post.coverImage && (
              <div className={styles.coverImageContainer}>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={900}
                  height={500}
                  priority
                  className={styles.articleCoverImg}
                />
              </div>
            )}
          </motion.div>

          {/* Social Share Bar (Top) */}
          <div className={styles.shareBar}>
            <span className={styles.shareLabel}>Share this article:</span>
            <div className={styles.shareButtons}>
              {/* LinkedIn */}
              <button
                onClick={() => handleSharePlatform('linkedin')}
                className={`${styles.shareBtn} ${styles.linkedin}`}
                title="Share on LinkedIn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </button>

              {/* X / Twitter */}
              <button
                onClick={() => handleSharePlatform('twitter')}
                className={`${styles.shareBtn} ${styles.twitter}`}
                title="Share on X (Twitter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X / Post</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleSharePlatform('facebook')}
                className={`${styles.shareBtn} ${styles.facebook}`}
                title="Share on Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.59 0 9 1.582 9 4.615V8z" />
                </svg>
                <span>Facebook</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyShareLink}
                className={`${styles.shareBtn} ${styles.copyBtn} ${linkCopied ? styles.copied : ''}`}
                title="Copy Article Link"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{linkCopied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Article Body Content */}
          <div className={styles.bodyContent}>
            {post.content.map((block, idx) => {
              if (block.type === 'heading2') {
                return (
                  <h2 key={idx} className={styles.heading2}>
                    {block.text}
                  </h2>
                );
              }

              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className={styles.paragraph}>
                    {block.text}
                  </p>
                );
              }

              if (block.type === 'code') {
                const isCopied = copiedCodeIndex === idx;
                return (
                  <div key={idx} className={styles.codeBlockWrapper}>
                    <div className={styles.codeHeader}>
                      <span className={styles.codeLang}>{block.language}</span>
                      <button
                        onClick={() => handleCopyCode(block.code, idx)}
                        className={styles.copyCodeBtn}
                        aria-label="Copy code to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ffff" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span style={{ color: '#00ffff' }}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className={styles.codePre}>
                      <code>{block.code}</code>
                    </pre>
                  </div>
                );
              }

              if (block.type === 'callout') {
                return (
                  <div key={idx} className={styles.callout}>
                    <div className={styles.calloutIcon}>💡</div>
                    <div>
                      {block.title && <div className={styles.calloutTitle}>{block.title}</div>}
                      <p className={styles.calloutText}>{block.text}</p>
                    </div>
                  </div>
                );
              }

              if (block.type === 'image') {
                return (
                  <figure key={idx} className={styles.articleFigure}>
                    <div className={styles.figureImageWrapper}>
                      <Image
                        src={block.src}
                        alt={block.alt || block.caption || 'Article illustration'}
                        width={800}
                        height={450}
                        className={styles.figureImg}
                      />
                    </div>
                    {block.caption && <figcaption className={styles.figcaption}>{block.caption}</figcaption>}
                  </figure>
                );
              }

              return null;
            })}
          </div>

          <div className={styles.divider} />

          {/* Bottom Social Share */}
          <div className={styles.bottomShare}>
            <h3>Did you find this article helpful?</h3>
            <p>Share it with your network or fellow developers!</p>
            <div className={styles.shareButtons}>
              <button
                onClick={() => handleSharePlatform('linkedin')}
                className={`${styles.shareBtn} ${styles.linkedin}`}
              >
                Share on LinkedIn
              </button>
              <button
                onClick={() => handleSharePlatform('twitter')}
                className={`${styles.shareBtn} ${styles.twitter}`}
              >
                Share on X
              </button>
              <button
                onClick={handleCopyShareLink}
                className={`${styles.shareBtn} ${styles.copyBtn} ${linkCopied ? styles.copied : ''}`}
              >
                {linkCopied ? '✓ Link Copied to Clipboard' : 'Copy Article Link'}
              </button>
            </div>
          </div>

          {/* Author CTA Box */}
          <div className={`glass-card ${styles.authorCard}`}>
            <div className={styles.authorCardHeader}>
              <div className={styles.authorAvatarLg}>
                <Image
                  src={post.author.avatar || '/profile.jpg'}
                  alt={post.author.name}
                  width={56}
                  height={56}
                  className={styles.authorAvatarLgImg}
                />
              </div>
              <div>
                <h3 className={styles.authorCardName}>Written by {post.author.name}</h3>
                <p className={styles.authorCardBio}>
                  Full Stack Software Engineer specializing in Next.js, React, Node.js, and high-performance WebGL architectures.
                </p>
              </div>
            </div>
            <div className={styles.authorCardActions}>
              <a href="https://linkedin.com/in/johnlitonmardy" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Connect on LinkedIn
              </a>
              <Link href="/#contact" className="btn btn-primary">
                Let&apos;s Work Together
              </Link>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>Recommended Articles</h2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((rel) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} className={`glass-card ${styles.relatedCard}`}>
                  {/* Thumbnail Image */}
                  {rel.coverImage && (
                    <div className={styles.relatedImageWrapper}>
                      <Image
                        src={rel.coverImage}
                        alt={rel.title}
                        width={450}
                        height={250}
                        className={styles.relatedCoverImg}
                      />
                    </div>
                  )}

                  <div className={styles.relatedMeta}>
                    <span>{rel.publishedAt}</span>
                    <span>•</span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h3 className={styles.relatedTitle}>{rel.title}</h3>
                  <p className={styles.relatedExcerpt}>{rel.excerpt}</p>
                  <span className={styles.relatedLink}>
                    Read Article →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
