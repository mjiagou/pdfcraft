import { notFound } from 'next/navigation';
import Link from 'next/link';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { locales, type Locale } from '@/lib/i18n/config';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import html from 'remark-html';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export async function generateStaticParams() {
  const results: Array<{ locale: Locale; slug: string }> = [];
  for (const locale of locales) {
    const dir = path.join(process.cwd(), 'content', 'blog', locale);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
      for (const f of files) {
        results.push({ locale, slug: f.replace(/\.md$/, '') });
      }
    }
  }
  return results;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const mdPath = path.join(process.cwd(), 'content', 'blog', locale, slug + '.md');

  if (!fs.existsSync(mdPath)) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  const file = fs.readFileSync(mdPath, 'utf8');
  const { data } = matter(file);

  return {
    title: `${data.title} - PDFCraft Blog`,
    description: data.excerpt || data.description || `Read ${data.title} on PDFCraft Blog`,
  };
}

interface BlogPostProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { locale, slug } = await params;
  const mdPath = path.join(process.cwd(), 'content', 'blog', locale, slug + '.md');
  if (!fs.existsSync(mdPath)) {
    notFound();
  }
  const file = fs.readFileSync(mdPath, 'utf8');
  const { data, content } = matter(file);
  const processed = await unified().use(remarkParse).use(html).process(content);
  const contentHtml = processed.toString();

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--color-background))]">
      <Header locale={locale} />

      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <article className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-sm text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors mb-8"
          >
            ← Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-[hsl(var(--color-foreground))] leading-tight">
              {data?.title ?? slug}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[hsl(var(--color-muted-foreground))]">
              {data?.date && (
                <time dateTime={String(data.date)} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[hsl(var(--color-primary))]"></span>
                  {new Date(data.date).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
              {data?.tags && Array.isArray(data.tags) && (
                <div className="flex gap-2">
                  {data.tags.map((tag: string) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[hsl(var(--color-primary)/0.1)] text-[hsl(var(--color-primary))] font-medium text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-bold prose-headings:text-[hsl(var(--color-foreground))]
              prose-p:text-[hsl(var(--color-muted-foreground))] prose-p:leading-relaxed
              prose-a:text-[hsl(var(--color-primary))] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[hsl(var(--color-foreground))]
              prose-code:text-[hsl(var(--color-primary))] prose-code:bg-[hsl(var(--color-primary)/0.1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[hsl(var(--color-muted))] prose-pre:border prose-pre:border-[hsl(var(--color-border))]
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
