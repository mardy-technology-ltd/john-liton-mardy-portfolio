'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCMS } from '@/context/CMSContext';
import styles from './Blog.module.css';

export default function Blog() {
  const { cmsData } = useCMS();
  const allBlogs = cmsData?.blogs || [];
  const featuredPosts = allBlogs.filter((b) => b.featured).slice(0, 3);
  const displayPosts = featuredPosts.length > 0 ? featuredPosts : allBlogs.slice(0, 3);

  return (
    <section id="blog" className={`section ${styles.blogSection}`}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">Articles &amp; Insights</p>
          <h2 className="section-title">Latest Writings</h2>
          <p className="section-subtitle">
            Thoughts, technical breakdowns, and guides on full-stack architecture, 3D web experiences, and engineering best practices.
          </p>
        </motion.div>

        {/* Featured Posts Grid */}
        <div className={styles.grid}>
          {displayPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              className={`glass-card ${styles.card}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Card Glow Border & Accent Line */}
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

              {/* Meta info: Date & Read time */}
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

              {/* Title */}
              <h3 className={styles.title}>
                <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
                  {post.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className={styles.excerpt}>{post.excerpt}</p>

              {/* Tags */}
              <div className={styles.tags}>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Read More Link */}
              <div className={styles.cardFooter}>
                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  <span>Read Article</span>
                  <svg
                    className={styles.arrowIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className={styles.viewAllWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/blog" className="btn btn-outline">
            <span>View All Articles</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
