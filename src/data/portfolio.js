// ============================================================
// John Liton Mardy — Portfolio Static Data
// ============================================================

export const personalInfo = {
  name: "John Liton Mardy",
  title: "Software Engineer",
  tagline: "Building tomorrow's digital experiences, today.",
  bio: "I'm a passionate Software Engineer who loves crafting high-performance, scalable applications. I thrive on turning complex problems into elegant, user-centric solutions. When I'm not coding, I'm exploring the latest in tech and open-source.",
  email: "john.liton.mardy@example.com",
  github: "https://github.com/johnlitonmardy",
  linkedin: "https://linkedin.com/in/johnlitonmardy",
  location: "Dhaka, Bangladesh",
  availableForWork: true,
};

export const skills = [
  // Frontend
  { name: "React", category: "Frontend", color: "#61DAFB", level: 95 },
  { name: "Next.js", category: "Frontend", color: "#FFFFFF", level: 90 },
  { name: "JavaScript", category: "Frontend", color: "#F7DF1E", level: 92 },
  { name: "TypeScript", category: "Frontend", color: "#3178C6", level: 85 },
  { name: "Three.js", category: "Frontend", color: "#049EF4", level: 75 },
  { name: "CSS / SCSS", category: "Frontend", color: "#CC6699", level: 88 },

  // Backend
  { name: "Node.js", category: "Backend", color: "#68A063", level: 88 },
  { name: "Express.js", category: "Backend", color: "#AAAAAA", level: 85 },
  { name: "Python", category: "Backend", color: "#FFD43B", level: 80 },
  { name: "REST API", category: "Backend", color: "#FF6B6B", level: 90 },
  { name: "GraphQL", category: "Backend", color: "#E10098", level: 70 },

  // Database & Cloud
  { name: "MongoDB", category: "Database", color: "#4DB33D", level: 85 },
  { name: "PostgreSQL", category: "Database", color: "#336791", level: 78 },
  { name: "Firebase", category: "Cloud", color: "#FFCA28", level: 80 },
  { name: "AWS", category: "Cloud", color: "#FF9900", level: 72 },
  { name: "Docker", category: "DevOps", color: "#2496ED", level: 75 },
  { name: "Git", category: "DevOps", color: "#F05032", level: 95 },
];

export const projects = [
  {
    id: 1,
    title: "NexaShop — E-Commerce Platform",
    description:
      "A full-stack e-commerce platform with real-time inventory, payment integration (Stripe), and an admin dashboard. Handles 10K+ products with optimized search.",
    tags: ["Next.js", "Node.js", "MongoDB", "Stripe", "Redis"],
    github: "https://github.com/johnlitonmardy/nexashop",
    live: "https://nexashop-demo.vercel.app",
    featured: true,
    color: "#00FFFF",
  },
  {
    id: 2,
    title: "TaskFlow — Project Management App",
    description:
      "A real-time collaborative project management tool inspired by Jira. Features drag-and-drop boards, WebSocket-based live updates, and role-based access control.",
    tags: ["React", "Socket.io", "Express", "PostgreSQL", "Docker"],
    github: "https://github.com/johnlitonmardy/taskflow",
    live: "https://taskflow-app.vercel.app",
    featured: true,
    color: "#A855F7",
  },
  {
    id: 3,
    title: "AuraAI — AI Chat Interface",
    description:
      "A sleek AI chat interface powered by OpenAI API with conversation history, custom personas, and markdown rendering. Built with a focus on UX.",
    tags: ["Next.js", "OpenAI API", "TypeScript", "Framer Motion"],
    github: "https://github.com/johnlitonmardy/aura-ai",
    live: "https://aura-ai-chat.vercel.app",
    featured: true,
    color: "#FF6B9D",
  },
  {
    id: 4,
    title: "CryptoTracker — Real-time Dashboard",
    description:
      "Live cryptocurrency tracking dashboard with portfolio management, price alerts, and historical chart analysis using Chart.js.",
    tags: ["React", "WebSocket", "Chart.js", "CoinGecko API"],
    github: "https://github.com/johnlitonmardy/crypto-tracker",
    live: "https://crypto-tracker-demo.vercel.app",
    featured: false,
    color: "#FFD700",
  },
  {
    id: 5,
    title: "DevBlog — Headless CMS Blog",
    description:
      "A performant developer blog with Sanity.io as CMS, ISR (Incremental Static Regeneration), syntax highlighting, and SEO optimization.",
    tags: ["Next.js", "Sanity.io", "MDX", "Vercel ISR"],
    github: "https://github.com/johnlitonmardy/devblog",
    live: "https://devblog-mardy.vercel.app",
    featured: false,
    color: "#34D399",
  },
  {
    id: 6,
    title: "AutoSched — Smart Scheduling API",
    description:
      "A RESTful scheduling microservice with conflict detection, timezone support, and Google Calendar integration, built with Python and FastAPI.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Google Calendar API"],
    github: "https://github.com/johnlitonmardy/autosched",
    live: null,
    featured: false,
    color: "#FB923C",
  },
];

export const experience = [
  {
    id: 1,
    role: "Senior Software Engineer",
    company: "TechNova Solutions",
    period: "2023 — Present",
    description:
      "Leading a team of 5 engineers to build a SaaS platform serving 50K+ users. Architected microservices with Node.js, optimized database queries (40% faster), and introduced CI/CD pipelines.",
    tech: ["Next.js", "Node.js", "AWS", "PostgreSQL", "Docker"],
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "Digital Crafters Ltd.",
    period: "2021 — 2023",
    description:
      "Developed and maintained 10+ client projects from e-commerce to dashboards. Introduced React to the tech stack and reduced page load times by 60% through code splitting and lazy loading.",
    tech: ["React", "Express.js", "MongoDB", "Firebase"],
  },
  {
    id: 3,
    role: "Junior Web Developer",
    company: "StartUp Hub BD",
    period: "2020 — 2021",
    description:
      "Built responsive web applications and REST APIs for early-stage startups. Collaborated closely with designers and product managers in an agile environment.",
    tech: ["JavaScript", "Node.js", "MySQL", "CSS"],
  },
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
