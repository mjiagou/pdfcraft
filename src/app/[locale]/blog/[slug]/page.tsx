import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { type Locale } from '@/lib/i18n/config';
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import { siteConfig } from '@/config/site';
import BlogPostClient from './BlogPostClient';

export function generateStaticParams() {
  return getAllPostSlugs();
}

interface BlogPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale, slug);

  if (!post) {
    return {
      title: `Article Not Found | ${siteConfig.name}`,
    };
  }

  const canonicalUrl = `${siteConfig.url}/${locale}/blog/${slug}`;
  const ogImage = post.coverImage?.startsWith('http')
    ? post.coverImage
    : `${siteConfig.url}${post.coverImage || siteConfig.ogImage}`;

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.description,
    keywords: [...post.tags, 'PDF', siteConfig.name],
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: siteConfig.name,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: `${post.title} | ${siteConfig.name}`,
      description: post.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${siteConfig.name}`,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const post = await getPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  // JSON-LD structured data for article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage?.startsWith('http')
      ? post.coverImage
      : `${siteConfig.url}${post.coverImage || siteConfig.ogImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/${locale}/blog/${slug}`,
    },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostClient locale={locale as Locale} post={post} />
    </>
  );
}
