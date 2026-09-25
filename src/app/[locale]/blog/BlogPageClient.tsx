'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { BlogPostMeta } from '@/lib/blog';
import { BookOpen, Calendar, Clock, Tag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface BlogPageClientProps {
  locale: Locale;
  posts: BlogPostMeta[];
}

export default function BlogPageClient({ locale, posts }: BlogPageClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const isZh = locale.startsWith('zh');

  // Collect all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header locale={locale} />

      <main className="flex-1 pt-28 pb-20" id="main-content">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8 gap-2" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {isZh ? '首页' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">
              {isZh ? '博客与实战教程' : 'Blog & Tutorials'}
            </span>
          </nav>

          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isZh ? 'PDF 技巧 · 办公效率 · 安全指南' : 'Guides · Privacy · Productivity'}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              {isZh ? 'TPSH PDF 知识库与实用指南' : 'TPSH PDF Blog & Learning Hub'}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {isZh
                ? '探索实用的 PDF 处理技巧、办公提效方案及浏览器端本地数据安全科普，助你轻松搞定任何文档难题。'
                : 'Master practical PDF workflows, in-browser privacy best practices, and productivity tips to streamline your everyday document tasks.'}
            </p>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                  selectedTag === null
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {isZh ? '全部文章' : 'All Topics'}
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {isZh ? '暂无匹配文章' : 'No articles found'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {isZh ? '正在持续更新中，敬请期待！' : 'More tutorials and guides are on the way!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta info: Date & Read Time */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTimeMinutes} {isZh ? '分钟阅读' : 'min read'}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                      <Link href={`/${locale}/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 flex-1">
                      {post.description}
                    </p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Read More */}
                  <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>{isZh ? '阅读完整教程' : 'Read Full Guide'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
