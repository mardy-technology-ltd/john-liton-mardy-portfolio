'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './HeroTerminal.module.css';

export default function HeroTerminal({ personalInfo }) {
  const info = personalInfo || {};
  const name = info.name || 'John Liton Mardy';
  const role = info.title || 'Software Engineer';
  const isAvailable = info.availableForWork !== false;

  // Structured Code Lines with syntax token categories
  const codeStructure = useMemo(() => [
    [
      { text: 'const ', type: 'kw' },
      { text: 'developer', type: 'ident' },
      { text: ' = {' }
    ],
    [
      { text: '  name' , type: 'prop' },
      { text: ': ' },
      { text: `'${name}'`, type: 'str' },
      { text: ',' }
    ],
    [
      { text: '  role' , type: 'prop' },
      { text: ': ' },
      { text: `'${role}'`, type: 'str' },
      { text: ',' }
    ],
    [
      { text: '  coreStack' , type: 'prop' },
      { text: ': [' }
    ],
    [
      { text: '    ' },
      { text: `'Next.js'`, type: 'str' },
      { text: ', ' },
      { text: `'React'`, type: 'str' },
      { text: ', ' },
      { text: `'TypeScript'`, type: 'str' },
      { text: ',' }
    ],
    [
      { text: '    ' },
      { text: `'Node.js'`, type: 'str' },
      { text: ', ' },
      { text: `'Three.js'`, type: 'str' },
      { text: ', ' },
      { text: `'Cloud'`, type: 'str' }
    ],
    [
      { text: '  ],' }
    ],
    [
      { text: '  architecture', type: 'prop' },
      { text: ': ' },
      { text: `'Scalable & High Performance'`, type: 'str' },
      { text: ',' }
    ],
    [
      { text: '  availableForHire', type: 'prop' },
      { text: ': ' },
      { text: isAvailable ? 'true' : 'false', type: 'bool' },
      { text: ',' }
    ],
    [
      { text: '  execute', type: 'prop' },
      { text: '(): ' },
      { text: 'Promise', type: 'type' },
      { text: '<' },
      { text: 'Impact', type: 'type' },
      { text: '> {' }
    ],
    [
      { text: '    return ', type: 'kw' },
      { text: 'shipExceptionalCode', type: 'func' },
      { text: '();' }
    ],
    [
      { text: '  }' }
    ],
    [
      { text: '};' }
    ]
  ], [name, role, isAvailable]);

  // Calculate total characters across all lines
  const totalCharacters = useMemo(() => {
    return codeStructure.reduce((total, line) => {
      return total + line.reduce((lineTot, token) => lineTot + token.text.length, 0);
    }, 0);
  }, [codeStructure]);

  const [charCount, setCharCount] = useState(0);
  const isFinished = charCount >= totalCharacters;

  // Real-time live character typing loop
  useEffect(() => {
    let timer;
    if (charCount < totalCharacters) {
      timer = setTimeout(() => {
        // Fast, realistic typing pace (12-24ms variation)
        const step = charCount < 30 ? 1 : 2; 
        setCharCount((prev) => Math.min(prev + step, totalCharacters));
      }, 16);
    }
    return () => clearTimeout(timer);
  }, [charCount, totalCharacters]);

  const handleReplay = useCallback(() => {
    setCharCount(0);
  }, []);

  // Render tokens progressively based on current charCount
  let accumulatedChars = 0;

  return (
    <motion.div
      className={styles.terminalWrapper}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
    >
      {/* Floating Badges */}
      <div className={styles.floatingBadgeTop}>
        <span style={{ fontSize: '0.85rem' }}>🚀</span>
        <span>5+ Years Exp</span>
      </div>

      <div className={styles.floatingBadgeBtm}>
        <span style={{ fontSize: '0.85rem' }}>⚡</span>
        <span>Clean Code Architect</span>
      </div>

      {/* Main Terminal Glass Card */}
      <div className={styles.terminalCard}>
        {/* Terminal Header */}
        <div className={styles.terminalHeader}>
          <div className={styles.windowControls}>
            <span className={`${styles.ctrlDot} ${styles.ctrlClose}`} />
            <span className={`${styles.ctrlDot} ${styles.ctrlMin}`} />
            <span className={`${styles.ctrlDot} ${styles.ctrlMax}`} />
          </div>

          <div className={styles.terminalTitle}>
            <span className={styles.terminalIcon}>⚡</span>
            <span>developer.config.ts</span>
          </div>

          <div className={styles.headerRight}>
            <button
              type="button"
              onClick={handleReplay}
              className={styles.replayBtn}
              title="Replay Code Typing"
            >
              <span>↺</span> Replay
            </button>
            <div className={styles.terminalBadge}>
              <span className={styles.terminalDot} />
              <span>ONLINE</span>
            </div>
          </div>
        </div>

        {/* Terminal Body with Real-Time Typing Code */}
        <div className={styles.terminalBody}>
          <div className={styles.codeLines}>
            {codeStructure.map((lineTokens, lineIdx) => {
              const lineNumStr = String(lineIdx + 1).padStart(2, '0');
              const lineStartChar = accumulatedChars;
              let lineCharsTotal = 0;
              lineTokens.forEach((t) => (lineCharsTotal += t.text.length));
              const lineEndChar = lineStartChar + lineCharsTotal;

              // If typewriter hasn't reached this line yet, don't show content
              if (charCount < lineStartChar) {
                return null;
              }

              // Is current active typing cursor on this line?
              const isCursorOnLine = charCount >= lineStartChar && charCount < lineEndChar;
              const isLastLineAndFinished = isFinished && lineIdx === codeStructure.length - 1;

              return (
                <div key={lineIdx} className={styles.codeLine}>
                  <span className={styles.lineNum}>{lineNumStr}</span>
                  <div style={{ display: 'inline-flex', flexWrap: 'nowrap' }}>
                    {lineTokens.map((token, tokenIdx) => {
                      const tokenStart = accumulatedChars;
                      const tokenEnd = tokenStart + token.text.length;
                      accumulatedChars = tokenEnd;

                      if (charCount <= tokenStart) {
                        return null;
                      }

                      const visibleLength = Math.max(0, Math.min(token.text.length, charCount - tokenStart));
                      const visibleText = token.text.slice(0, visibleLength);

                      const tokenClass =
                        token.type === 'kw'
                          ? styles.kw
                          : token.type === 'ident'
                          ? styles.ident
                          : token.type === 'type'
                          ? styles.type
                          : token.type === 'prop'
                          ? styles.prop
                          : token.type === 'str'
                          ? styles.str
                          : token.type === 'bool'
                          ? styles.bool
                          : token.type === 'func'
                          ? styles.func
                          : undefined;

                      return (
                        <span key={tokenIdx} className={tokenClass}>
                          {visibleText}
                        </span>
                      );
                    })}

                    {/* Show Blinking Cursor at the active typing tip */}
                    {(isCursorOnLine || isLastLineAndFinished) && (
                      <span className={styles.cursor}>|</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Terminal Footer HUD */}
        <div className={styles.terminalFooter}>
          <div className={styles.hudStat}>
            <span className={styles.hudLabel}>STACK</span>
            <span className={styles.hudVal}>FULL-STACK / CLOUD</span>
          </div>
          <div className={styles.hudStat}>
            <span className={styles.hudLabel}>LATENCY</span>
            <span className={styles.hudVal} style={{ color: '#10b981' }}>⚡ 12ms</span>
          </div>
          <div className={styles.hudStat}>
            <span className={styles.hudLabel}>STATUS</span>
            <span className={styles.hudVal} style={{ color: 'var(--clr-cyan)' }}>READY TO SHIP</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
