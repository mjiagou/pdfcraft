'use client';

import React from 'react';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RelatedToolsCTA } from '@/components/blog/RelatedToolsCTA';
import type { BlogPost } from '@/lib/blog';
import { Calendar, Clock, User, ArrowLeft, Share2, Tag, ShieldCheck } from 'lucide-react';

interface BlogPostClientProps {
  locale: Locale;
  post: BlogPost;
}

export default function BlogPostClient({ locale, post }: BlogPostClientProps) {
  const isZh = locale.startsWith('zh');

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert(isZh ? '文章链接已复制到剪贴板！' : 'Article link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header locale={locale} />

      <main className="flex-1 pt-28 pb-20" id="main-content">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8 gap-2 flex-wrap" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {isZh ? '首页' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/blog`} className="hover:text-primary transition-colors">
              {isZh ? '博客与实战教程' : 'Blog'}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-xs md:max-w-md">
              {post.title}
            </span>
          </nav>

          {/* Article Header */}
          <header className="mb-10 pb-8 border-b border-border">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2] mb-6">
              {post.title}
            </h1>

            {/* Sub-description summary */}
            {post.description && (
              <p className="text-base md:text-xl text-muted-foreground leading-relaxed mb-6 font-normal">
                {post.description}
              </p>
            )}

            {/* Author, Date, Read Time, Share */}
            <div className="flex items-center justify-between flex-wrap gap-4 text-xs md:text-sm text-muted-foreground pt-4 border-t border-border/50">
              <div className="flex items-center gap-5 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <User className="w-4 h-4 text-primary" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTimeMinutes} {isZh ? '分钟阅读' : 'min read'}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-card hover:text-primary transition-all text-xs"
                title={isZh ? '分享本文' : 'Share article'}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isZh ? '分享' : 'Share'}</span>
              </button>
            </div>
          </header>

          {/* Markdown HTML Body */}
          <div
            className="prose dark:prose-invert prose-lg max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:my-4
              prose-li:text-muted-foreground prose-li:my-1
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:underline hover:prose-a:opacity-80
              prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-muted-foreground
              prose-hr:border-border prose-hr:my-8"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Related Tools CTA Block */}
          {post.relatedTools && post.relatedTools.length > 0 && (
            <RelatedToolsCTA toolIds={post.relatedTools} locale={locale} />
          )}

          {/* Back to Blog Button */}
          <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{isZh ? '返回全部文章列表' : 'Back to all articles'}</span>
            </Link>

            <Link
              href={`/${locale}/tools`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{isZh ? '浏览全部 67+ PDF 工具' : 'Explore all 67+ PDF tools'}</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
