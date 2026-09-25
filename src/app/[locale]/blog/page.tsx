import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/config/site';
import BlogPageClient from './BlogPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const isZh = validLocale.startsWith('zh');

  const title = isZh
    ? `PDF技巧与使用指南 - 博客知识库 | ${siteConfig.name}`
    : `PDF Tutorials, Guides & Best Practices - Blog | ${siteConfig.name}`;

  const description = isZh
    ? `浏览 TPSH PDF 官方教程与知识库。了解如何快速压缩、合并、拆分、转换与编辑 PDF，掌握本地隐私数据安全处理技巧。`
    : `Explore TPSH PDF tutorials and guides. Learn how to compress, merge, split, convert, and edit PDFs locally without uploading files to the cloud.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${validLocale}/blog`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${validLocale}/blog`,
      type: 'website',
      siteName: siteConfig.name,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const posts = await getAllPosts(locale);

  return <BlogPageClient locale={locale as Locale} posts={posts} />;
}
