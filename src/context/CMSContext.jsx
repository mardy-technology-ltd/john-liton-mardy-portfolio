'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { themePresets, defaultCMSData } from '@/data/cmsData';
import { skills as initialSkills, projects as initialProjects, experience as initialExperience } from '@/data/portfolio';
import { blogs as initialBlogs } from '@/data/blogs';

const CMSContext = createContext(null);

const STORAGE_KEY = 'jlm_portfolio_cms_v1';

export function CMSProvider({ children }) {
  const [data, setData] = useState({
    ...defaultCMSData,
    skills: initialSkills,
    projects: initialProjects,
    experience: initialExperience,
    blogs: initialBlogs,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved configuration from localStorage + Supabase on mount
  useEffect(() => {
    let localData = null;

    // 1. Instant load from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.about?.label && parsed.about.label.includes('<//')) {
          parsed.about.label = 'Who I Am';
        }
        localData = parsed;
        setData((prev) => ({
          ...prev,
          ...parsed,
          themeConfig: { ...prev.themeConfig, ...parsed.themeConfig },
          personalInfo: {
            ...prev.personalInfo,
            ...parsed.personalInfo,
            socialLinks: parsed.personalInfo?.socialLinks?.length ? parsed.personalInfo.socialLinks : (prev.personalInfo?.socialLinks || defaultCMSData.personalInfo.socialLinks),
          },
          about: { ...prev.about, ...parsed.about },
          sectionVisibility: { ...prev.sectionVisibility, ...parsed.sectionVisibility },
          skills: parsed.skills || prev.skills,
          projects: parsed.projects || prev.projects,
          experience: parsed.experience || prev.experience,
          blogs: parsed.blogs || prev.blogs,
          messages: parsed.messages || prev.messages || defaultCMSData.messages,
        }));
      }
    } catch (e) {
      console.error('Failed to load CMS state from localStorage', e);
    }
    setIsLoaded(true);

    // 2. Fetch latest global CMS snapshot from Supabase via API
    fetch('/api/cms/sync')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const cloud = res.data;
          setData((prev) => {
            const merged = {
              ...prev,
              ...cloud,
              themeConfig: { ...prev.themeConfig, ...(cloud.themeConfig || {}) },
              personalInfo: { ...prev.personalInfo, ...(cloud.personalInfo || {}) },
              about: { ...prev.about, ...(cloud.about || {}) },
              sectionVisibility: { ...prev.sectionVisibility, ...(cloud.sectionVisibility || {}) },
              skills: cloud.skills || prev.skills,
              projects: cloud.projects || prev.projects,
              experience: cloud.experience || prev.experience,
              blogs: cloud.blogs || prev.blogs,
              messages: cloud.messages || prev.messages,
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch (err) {}
            return merged;
          });
        }
      })
      .catch((err) => {
        // Silent fallback to local storage
      });
  }, []);

  // Save changes to localStorage + Cloud Supabase
  const saveState = (updater) => {
    setData((prev) => {
      const newState = typeof updater === 'function' ? updater(prev) : updater;
      
      // 1. Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (e) {
        console.error('Failed to save CMS state to localStorage', e);
      }

      // 2. Background sync to Supabase
      fetch('/api/cms/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState),
      }).catch((err) => {
        // Silent background fallback
      });

      return newState;
    });
  };

  // Dynamically inject CSS variables into document root whenever theme changes
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const themeKey = data.themeConfig.activeTheme || 'cyberpunk-neon';
    const preset = themePresets[themeKey] || themePresets['cyberpunk-neon'];
    const colors = data.themeConfig.customColors || preset.colors;

    const root = document.documentElement;

    // Apply primary & secondary accents
    root.style.setProperty('--clr-cyan', colors.primary);
    root.style.setProperty('--clr-purple', colors.secondary);
    root.style.setProperty('--clr-pink', colors.accentPink || '#ff6b9d');

    // Apply background colors
    root.style.setProperty('--clr-bg-primary', colors.bgPrimary);
    root.style.setProperty('--clr-bg-secondary', colors.bgSecondary);
    root.style.setProperty('--clr-bg-tertiary', colors.bgTertiary);

    // Apply text & border colors
    root.style.setProperty('--clr-text-primary', colors.textPrimary);
    root.style.setProperty('--clr-text-secondary', colors.textSecondary);
    root.style.setProperty('--clr-border', colors.border);
    root.style.setProperty('--clr-border-hover', colors.borderHover);

    // Apply glows
    root.style.setProperty(
      '--glow-cyan',
      `0 0 20px ${colors.glowPrimary}, 0 0 40px ${colors.glowPrimary}`
    );
    root.style.setProperty(
      '--glow-purple',
      `0 0 20px ${colors.glowSecondary}, 0 0 40px ${colors.glowSecondary}`
    );
  }, [data.themeConfig]);

  // Actions
  const setTheme = (themeId) => {
    saveState((prev) => ({
      ...prev,
      themeConfig: {
        ...prev.themeConfig,
        activeTheme: themeId,
        customColors: null, // clear custom overrides when selecting preset
      },
    }));
  };

  const setCustomColors = (customColors) => {
    saveState((prev) => ({
      ...prev,
      themeConfig: {
        ...prev.themeConfig,
        activeTheme: 'custom',
        customColors,
      },
    }));
  };

  const updateThemeConfig = (config) => {
    saveState((prev) => ({
      ...prev,
      themeConfig: {
        ...prev.themeConfig,
        ...config,
      },
    }));
  };

  const updatePersonalInfo = (info) => {
    saveState((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const updateAbout = (aboutData) => {
    saveState((prev) => ({
      ...prev,
      about: { ...prev.about, ...aboutData },
    }));
  };

  const updateSkills = (skillsList) => {
    saveState((prev) => ({
      ...prev,
      skills: skillsList,
    }));
  };

  const updateProjects = (projectsList) => {
    saveState((prev) => ({
      ...prev,
      projects: projectsList,
    }));
  };

  const updateExperience = (experienceList) => {
    saveState((prev) => ({
      ...prev,
      experience: experienceList,
    }));
  };

  const updateBlogs = (blogsList) => {
    saveState((prev) => ({
      ...prev,
      blogs: blogsList,
    }));
  };

  const addMessage = (messageObj) => {
    const newMsg = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      date: new Date().toISOString(),
      status: 'unread',
      ...messageObj,
    };
    saveState((prev) => ({
      ...prev,
      messages: [newMsg, ...(prev.messages || [])],
    }));
    return newMsg;
  };

  const deleteMessage = (id) => {
    saveState((prev) => ({
      ...prev,
      messages: (prev.messages || []).filter((m) => m.id !== id),
    }));
  };

  const updateMessageStatus = (id, newStatus) => {
    saveState((prev) => ({
      ...prev,
      messages: (prev.messages || []).map((m) =>
        m.id === id ? { ...m, status: newStatus } : m
      ),
    }));
  };

  const toggleSectionVisibility = (sectionKey) => {
    saveState((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionKey]: !prev.sectionVisibility[sectionKey],
      },
    }));
  };

  const resetToDefaults = () => {
    const fresh = {
      ...defaultCMSData,
      skills: initialSkills,
      projects: initialProjects,
      experience: initialExperience,
      blogs: initialBlogs,
      messages: defaultCMSData.messages,
    };
    saveState(fresh);
  };

  const unreadMessagesCount = (data?.messages || []).filter((m) => m.status === 'unread').length;

  return (
    <CMSContext.Provider
      value={{
        cmsData: data,
        themeConfig: data?.themeConfig || defaultCMSData.themeConfig,
        personalInfo: data?.personalInfo || defaultCMSData.personalInfo,
        about: data?.about || defaultCMSData.about,
        sectionVisibility: data?.sectionVisibility || defaultCMSData.sectionVisibility,
        skills: data?.skills || initialSkills,
        projects: data?.projects || initialProjects,
        experience: data?.experience || initialExperience,
        blogs: data?.blogs || initialBlogs,
        messages: data?.messages || defaultCMSData.messages,
        unreadMessagesCount,
        isLoaded,
        setTheme,
        setCustomColors,
        updateThemeConfig,
        updatePersonalInfo,
        updateAbout,
        updateSkills,
        updateProjects,
        updateExperience,
        updateBlogs,
        addMessage,
        deleteMessage,
        updateMessageStatus,
        toggleSectionVisibility,
        resetToDefaults,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
