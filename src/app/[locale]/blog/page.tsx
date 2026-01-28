import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { locales, type Locale } from '@/lib/i18n/config';
import matter from 'gray-matter';

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
    <section>
      <h1>Blog</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/${locale}/blog/${p.slug}`}>{p.title ?? p.slug}</Link>
            {p.date && <span> — {String(p.date)}</span>}
            {p.excerpt && <p>{p.excerpt}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
