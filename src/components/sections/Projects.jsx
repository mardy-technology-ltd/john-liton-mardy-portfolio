'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '@/context/CMSContext';
import styles from './Projects.module.css';

function ProjectCard({ project, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -10;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      className={`glass-card ${styles.card} ${project.featured ? styles.featured : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.1s ease',
      }}
    >
      {/* Top accent line */}
      <div className={styles.accentLine} style={{ background: project.color }} />

      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.projectIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={project.color} strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>

        {project.featured && (
          <span className={styles.featuredBadge}>★ Featured</span>
        )}

        {/* Links */}
        <div className={styles.links}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.iconLink} title="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.iconLink} title="Live Demo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className={styles.title} style={{ '--accent': project.color }}>
        {project.title}
      </h3>
      <p className={styles.description}>{project.description}</p>

      {/* Tags */}
      <div className="tag-row" style={{ marginTop: 'auto' }}>
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* Glow overlay */}
      <div className={styles.glow} style={{ background: `radial-gradient(circle at 30% 0%, ${project.color}12 0%, transparent 60%)` }} />
    </motion.div>
  );
}

export default function Projects() {
  const { cmsData } = useCMS();
  const [showAll, setShowAll] = useState(false);
  const allProjects = cmsData?.projects || [];
  const visible = showAll ? allProjects : allProjects.slice(0, 3);

  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className={`orb orb-purple ${styles.orb}`} style={{ width: 400, height: 400 }} />

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">&lt;// SECTION: PORTFOLIO &amp; WORKS /&gt;</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A selection of projects that showcase my skills and passion for building great software.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {visible.map((project, i) => (
            <ProjectCard key={project.id || i} project={project} index={i} />
          ))}
        </div>

        {!showAll && allProjects.length > 3 && (
          <motion.div
            className={styles.showMoreWrapper}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button className="btn btn-outline" onClick={() => setShowAll(true)}>
              Show All Projects ({allProjects.length})
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
