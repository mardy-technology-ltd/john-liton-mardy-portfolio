import { notFound } from 'next/navigation';
import { getBlogBySlug, getAllBlogs, getRelatedBlogs } from '@/data/blogs';
import ArticleClient from './ArticleClient';

// SSG: Generate static routes for all blog slugs
export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((post) => ({
    slug: post.slug,
  }));
}

// Dynamic SEO & OpenGraph metadata for search engines and social sharing (LinkedIn/Twitter/Facebook)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | John Liton Mardy',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${post.title} | John Liton Mardy`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogs(slug, 2);

  return <ArticleClient post={post} relatedPosts={relatedPosts} />;
}
