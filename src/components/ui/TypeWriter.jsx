'use client';

import { useState, useEffect } from 'react';
import styles from './TypeWriter.module.css';

export default function TypeWriter({ texts, speed = 80, deleteSpeed = 40, delay = 2000 }) {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    const target = texts[textIndex];
    const tick = isDeleting ? deleteSpeed : speed;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < target.length) {
          setCurrentText(target.slice(0, currentText.length + 1));
        } else {
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, tick);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, isPaused, textIndex, texts, speed, deleteSpeed, delay]);

  return (
    <span className={styles.wrapper}>
      <span className={styles.text}>{currentText}</span>
      <span className={styles.cursor}>|</span>
    </span>
  );
}
