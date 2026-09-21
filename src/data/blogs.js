// ============================================================
// John Liton Mardy — Static Blog Data & Utilities
// ============================================================

export const blogs = [
  {
    id: 1,
    slug: "building-high-performance-nextjs-14-applications",
    title: "Building High-Performance Next.js 14 Apps: Architecture & Best Practices",
    excerpt:
      "A deep dive into App Router architecture, Server Components, Streaming SSR, and Incremental Static Regeneration for blazing-fast web apps.",
    coverImage: "/images/blog/nextjs-performance.svg",
    publishedAt: "September 18, 2026",
    readTime: "6 min read",
    tags: ["Next.js", "React", "Architecture", "Performance"],
    featured: true,
    author: {
      name: "John Liton Mardy",
      role: "Software Engineer",
      avatar: "/profile.jpg",
    },
    content: [
      {
        type: "paragraph",
        text: "Building modern web applications requires balancing developer velocity with end-user performance. With Next.js 14 and the App Router, React Server Components (RSC) have fundamentally transformed how we think about rendering and data fetching on the web.",
      },
      {
        type: "heading2",
        text: "1. The Power of React Server Components (RSC)",
      },
      {
        type: "paragraph",
        text: "By moving non-interactive rendering to the server, client bundles remain lightweight. Heavy dependencies like markdown parsers, date formatters, and database drivers stay completely on the server, resulting in near-zero client bundle impact for static content.",
      },
      {
        type: "code",
        language: "javascript",
        code: `// app/products/page.js - Server Component by default
import db from '@/lib/db';
import ProductGrid from '@/components/ProductGrid';

export default async function ProductsPage() {
  // Direct server-side data fetching with zero client bundle overhead!
  const products = await db.products.findMany({
    where: { inStock: true },
    take: 12,
  });

  return (
    <main className="container">
      <h1>Featured Products</h1>
      <ProductGrid products={products} />
    </main>
  );
}`,
      },
      {
        type: "callout",
        title: "Key Takeaway",
        text: "Keep client components at the leaves of your component tree. Fetch data in Server Components and pass it down as props to interactive Client Components.",
      },
      {
        type: "heading2",
        text: "2. Streaming & Suspense for Instant Visual Feedback",
      },
      {
        type: "paragraph",
        text: "Rather than waiting for the entire page's data to load before sending HTML, Next.js allows you to stream parts of the page as they resolve. This dramatically lowers Time to First Byte (TTFB) and First Contentful Paint (FCP).",
      },
      {
        type: "code",
        language: "javascript",
        code: `import { Suspense } from 'react';
import SlowComponent from '@/components/SlowComponent';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function Dashboard() {
  return (
    <div>
      <h1>User Dashboard</h1>
      {/* Fast parts render instantly, slow parts stream in seamlessly */}
      <Suspense fallback={<SkeletonLoader />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}`,
      },
      {
        type: "heading2",
        text: "3. Incremental Static Regeneration (ISR)",
      },
      {
        type: "paragraph",
        text: "ISR provides the best of both static and dynamic worlds: blazing fast CDN delivery with automated on-demand background regeneration whenever data changes.",
      },
      {
        type: "paragraph",
        text: "Combining these architectural principles ensures your web application scores 95+ across all Google Lighthouse metrics while delivering a delightful user experience.",
      },
    ],
  },
  {
    id: 2,
    slug: "interactive-3d-graphics-in-react-with-threejs",
    title: "Creating Immersive 3D Experiences in React with Three.js & Fiber",
    excerpt:
      "Learn how to integrate interactive 3D elements, particle systems, and custom shaders into modern web applications without compromising frame rates.",
    coverImage: "/images/blog/threejs-guide.svg",
    publishedAt: "September 12, 2026",
    readTime: "8 min read",
    tags: ["Three.js", "WebGL", "React", "3D Web"],
    featured: true,
    author: {
      name: "John Liton Mardy",
      role: "Software Engineer",
      avatar: "/profile.jpg",
    },
    content: [
      {
        type: "paragraph",
        text: "WebGL and Three.js have made 3D graphics on the web accessible to frontend engineers. When paired with React Three Fiber (R3F), you can build declarative, component-driven 3D scenes that react effortlessly to user state and scroll events.",
      },
      {
        type: "heading2",
        text: "Optimizing Three.js for 60fps Performance",
      },
      {
        type: "paragraph",
        text: "Rendering 3D models can easily cause frame drops on mobile devices if not managed carefully. The golden rule is to minimize draw calls and reuse geometries and materials across meshes.",
      },
      {
        type: "code",
        language: "javascript",
        code: `import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RotatingParticles({ count = 1000 }) {
  const pointsRef = useRef();

  // Smooth rotation on every frame without re-rendering the component
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1;
      pointsRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <pointsMaterial
        size={0.02}
        color="#00ffff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}`,
      },
      {
        type: "callout",
        title: "Pro Tip",
        text: "Always dynamically import Three.js canvases in Next.js using ssr: false to prevent hydration mismatches and minimize server overhead.",
      },
      {
        type: "heading2",
        text: "Scroll-Driven 3D Animations",
      },
      {
        type: "paragraph",
        text: "By binding the camera position or mesh rotation to window scroll position or mouse movement, you create an immersive spatial feel that captures user attention immediately.",
      },
    ],
  },
  {
    id: 3,
    slug: "architecting-scalable-microservices-with-nodejs-docker",
    title: "Architecting Scalable Microservices with Node.js, Docker & PostgreSQL",
    excerpt:
      "A pragmatic guide to building fault-tolerant microservices, handling asynchronous message queues, and deploying containerized services.",
    coverImage: "/images/blog/microservices-architecture.svg",
    publishedAt: "August 28, 2026",
    readTime: "7 min read",
    tags: ["Node.js", "Docker", "PostgreSQL", "Microservices"],
    featured: true,
    author: {
      name: "John Liton Mardy",
      role: "Software Engineer",
      avatar: "/profile.jpg",
    },
    content: [
      {
        type: "paragraph",
        text: "As applications grow in complexity, monolithic architectures often experience bottlenecks in deployment cycles and resource scaling. Transitioning to containerized microservices provides isolation, independent scaling, and fault containment.",
      },
      {
        type: "heading2",
        text: "Designing Domain Boundaries",
      },
      {
        type: "paragraph",
        text: "The most common mistake when adopting microservices is splitting by technical layers rather than business domain boundaries. Each microservice should own its domain model, business rules, and private database.",
      },
      {
        type: "code",
        language: "dockerfile",
        code: `# Multi-stage Dockerfile for production Node.js microservice
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 4000
USER node
CMD ["node", "server.js"]`,
      },
      {
        type: "heading2",
        text: "Resilient Database Access & Connection Pooling",
      },
      {
        type: "paragraph",
        text: "Managing concurrent connections to PostgreSQL is vital. Using a pooling layer like PgBouncer or Prisma connection management prevents connection starvation during traffic spikes.",
      },
      {
        type: "callout",
        title: "Best Practice",
        text: "Never allow one microservice to query another service's database directly. Communicate via REST APIs, gRPC, or asynchronous message brokers like RabbitMQ or Kafka.",
      },
    ],
  },
  {
    id: 4,
    slug: "mastering-framer-motion-for-micro-interactions",
    title: "Mastering Framer Motion: Crafting Fluid UI Micro-Interactions",
    excerpt:
      "How to implement spring physics, layout animations, gestures, and page transitions that elevate standard web apps into world-class digital products.",
    coverImage: "/images/blog/framer-motion-ui.svg",
    publishedAt: "August 15, 2026",
    readTime: "5 min read",
    tags: ["UI/UX", "Framer Motion", "React", "Frontend"],
    featured: false,
    author: {
      name: "John Liton Mardy",
      role: "Software Engineer",
      avatar: "/profile.jpg",
    },
    content: [
      {
        type: "paragraph",
        text: "Micro-interactions are the subtle visual and sensory cues that guide users, convey system state, and create emotional delight. Framer Motion makes physics-based animations in React remarkably straightforward.",
      },
      {
        type: "heading2",
        text: "Why Spring Physics Beat Linear Easing",
      },
      {
        type: "paragraph",
        text: "Traditional CSS transitions often feel robotic because they use fixed duration curves. Spring physics simulate real-world mass, stiffness, and damping, ensuring interrupted animations seamlessly transition without visual jumps.",
      },
      {
        type: "code",
        language: "javascript",
        code: `import { motion } from 'framer-motion';

export const InteractiveButton = ({ children, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 255, 255, 0.4)" }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className="btn-glow"
    >
      {children}
    </motion.button>
  );
};`,
      },
      {
        type: "heading2",
        text: "Shared Layout Animations with layoutId",
      },
      {
        type: "paragraph",
        text: "With Framer Motion's layoutId prop, you can animate elements between completely different parts of the React component tree (e.g., active navigation pills, tabs, and expandable cards).",
      },
    ],
  },
];

// Helper Functions
export function getAllBlogs() {
  return blogs;
}

export function getFeaturedBlogs() {
  return blogs.filter((b) => b.featured);
}

export function getBlogBySlug(slug) {
  return blogs.find((b) => b.slug === slug) || null;
}

export function getRelatedBlogs(currentSlug, limit = 2) {
  return blogs.filter((b) => b.slug !== currentSlug).slice(0, limit);
}

export function getAllTags() {
  const tags = new Set();
  blogs.forEach((b) => b.tags.forEach((t) => tags.add(t)));
  return ["All", ...Array.from(tags)];
}
