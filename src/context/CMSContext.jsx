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

  // Load saved configuration from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.about?.label && parsed.about.label.includes('<//')) {
          parsed.about.label = 'Who I Am';
        }
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
        }));
      }
    } catch (e) {
      console.error('Failed to load CMS state from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  const saveState = (newState) => {
    setData(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save CMS state to localStorage', e);
    }
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
    saveState({
      ...data,
      themeConfig: {
        ...data.themeConfig,
        activeTheme: themeId,
        customColors: null, // clear custom overrides when selecting preset
      },
    });
  };

  const setCustomColors = (customColors) => {
    saveState({
      ...data,
      themeConfig: {
        ...data.themeConfig,
        activeTheme: 'custom',
        customColors,
      },
    });
  };

  const updateThemeConfig = (config) => {
    saveState({
      ...data,
      themeConfig: {
        ...data.themeConfig,
        ...config,
      },
    });
  };

  const updatePersonalInfo = (info) => {
    saveState({
      ...data,
      personalInfo: { ...data.personalInfo, ...info },
    });
  };

  const updateAbout = (aboutData) => {
    saveState({
      ...data,
      about: { ...data.about, ...aboutData },
    });
  };

  const updateSkills = (skillsList) => {
    saveState({
      ...data,
      skills: skillsList,
    });
  };

  const updateProjects = (projectsList) => {
    saveState({
      ...data,
      projects: projectsList,
    });
  };

  const updateExperience = (experienceList) => {
    saveState({
      ...data,
      experience: experienceList,
    });
  };

  const updateBlogs = (blogsList) => {
    saveState({
      ...data,
      blogs: blogsList,
    });
  };

  const toggleSectionVisibility = (sectionKey) => {
    saveState({
      ...data,
      sectionVisibility: {
        ...data.sectionVisibility,
        [sectionKey]: !data.sectionVisibility[sectionKey],
      },
    });
  };

  const resetToDefaults = () => {
    const fresh = {
      ...defaultCMSData,
      skills: initialSkills,
      projects: initialProjects,
      experience: initialExperience,
      blogs: initialBlogs,
    };
    saveState(fresh);
  };

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
