import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { locales, type Locale } from '@/lib/i18n/config';
import matter from 'gray-matter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Generate static params for each locale
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface BlogIndexProps {
  params: Promise<{ locale: Locale }>;
}

export default async function BlogIndex({ params }: BlogIndexProps) {
  const { locale } = await params;
  const dir = path.join(process.cwd(), 'content', 'blog', locale);
  const posts: Array<{ slug: string; title?: string; date?: string; excerpt?: string }> = [];

  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.md')) {
        const full = path.join(dir, file);
        const content = fs.readFileSync(full, 'utf8');
        const { data } = matter(content);
        posts.push({
          slug: file.replace(/\.md$/, ''),
          title: data?.title,
          date: data?.date,
          excerpt: data?.excerpt ?? data?.description,
        });
      }
    }
  }

  // Sort by date descending if available
  posts.sort((a, b) => {
    const ad = a.date ? new Date(a.date).getTime() : 0;
    const bd = b.date ? new Date(b.date).getTime() : 0;
    return bd - ad;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--color-background))]">
      <Header locale={locale} />

      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-[hsl(var(--color-foreground))]">Blog</h1>
          <p className="text-[hsl(var(--color-muted-foreground))] mb-12 text-lg">
            Latest updates, guides, and articles.
          </p>

          <div className="grid gap-8">
            {posts.map((p) => (
              <article key={p.slug} className="group relative flex flex-col gap-3 p-6 glass-card rounded-2xl hover:shadow-lg transition-all duration-300 border border-[hsl(var(--color-border))]">
                <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))]">
                  {p.date && <time dateTime={String(p.date)}>{new Date(p.date).toLocaleDateString(locale)}</time>}
                </div>

                <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] group-hover:text-[hsl(var(--color-primary))] transition-colors">
                  <Link href={`/${locale}/blog/${p.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {p.title ?? p.slug}
                  </Link>
                </h2>

                {p.excerpt && (
                  <p className="text-[hsl(var(--color-muted-foreground))] line-clamp-3 leading-relaxed">
                    {p.excerpt}
                  </p>
                )}

                <div className="mt-4 flex items-center text-[hsl(var(--color-primary))] font-medium text-sm">
                  Read more <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </article>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-20 text-[hsl(var(--color-muted-foreground))]">
                <p>No posts found.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
