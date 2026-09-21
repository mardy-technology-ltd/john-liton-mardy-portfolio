import './globals.css';
import { CMSProvider } from '@/context/CMSContext';

export const metadata = {
  title: 'John Liton Mardy | Software Engineer',
  description:
    'Full Stack Software Engineer specializing in building high-performance web applications with React, Next.js, Node.js, and immersive 3D web experiences.',
  keywords: 'Software Engineer, Full Stack Developer, React, Next.js, Three.js, Portfolio, John Liton Mardy',
  authors: [{ name: 'John Liton Mardy' }],
  openGraph: {
    title: 'John Liton Mardy | Software Engineer',
    description: 'Full Stack Developer building stunning, high-performance web experiences.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CMSProvider>
          {children}
        </CMSProvider>
      </body>
    </html>
  );
}
