import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { locales, type Locale } from '@/lib/i18n/config';
import { remark } from 'remark';
import html from 'remark-html';

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
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();
  return (
    <article>
      <h1>{data?.title ?? slug}</h1>
      {data?.date && <p>{String(data.date)}</p>}
      {data?.excerpt && <p>{data.excerpt}</p>}
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}
