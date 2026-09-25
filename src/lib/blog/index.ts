import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { type Locale, locales } from '../i18n/config';

export interface BlogPostMeta {
  slug: string;
  locale: string;
  title: string;
  description: string;
  date: string;
  author: string;
  coverImage?: string;
  tags: string[];
  relatedTools: string[];
  readTimeMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Lightweight zero-dependency frontmatter parser
 */
function parseFrontmatter(fileContent: string): { meta: Record<string, any>; body: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { meta: {}, body: fileContent };
  }

  const rawMeta = match[1];
  const body = match[2];
  const meta: Record<string, any> = {};

  const lines = rawMeta.split(/\r?\n/);
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse array if formatted as [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      const items = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      meta[key] = items;
    } else if (value === 'true') {
      meta[key] = true;
    } else if (value === 'false') {
      meta[key] = false;
    } else {
      meta[key] = value;
    }
  }

  return { meta, body };
}

/**
 * Calculate read time based on word count
 */
function calculateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  // Estimate ~200 words per minute for English, ~350 chars for CJK
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Get all blog posts for a specific locale (with fallback to en)
 */
export async function getAllPosts(locale: string = 'en'): Promise<BlogPostMeta[]> {
  const targetLocale = fs.existsSync(path.join(CONTENT_DIR, locale)) ? locale : 'en';
  const targetDir = path.join(CONTENT_DIR, targetLocale);

  if (!fs.existsSync(targetDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(targetDir).filter((file) => file.endsWith('.md'));
  const posts: BlogPostMeta[] = [];

  for (const fileName of fileNames) {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(targetDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { meta, body } = parseFrontmatter(fileContents);

    posts.push({
      slug,
      locale: targetLocale,
      title: meta.title || slug,
      description: meta.description || '',
      date: meta.date || '2026-09-25',
      author: meta.author || 'TPSH PDF Team',
      coverImage: meta.coverImage || '/images/og-image.png',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      relatedTools: Array.isArray(meta.relatedTools) ? meta.relatedTools : [],
      readTimeMinutes: calculateReadTime(body),
    });
  }

  // Sort posts by date descending
  return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

/**
 * Get single blog post by slug and locale
 */
export async function getPostBySlug(locale: string, slug: string): Promise<BlogPost | null> {
  const localeDir = fs.existsSync(path.join(CONTENT_DIR, locale)) ? locale : 'en';
  let fullPath = path.join(CONTENT_DIR, localeDir, `${slug}.md`);

  // Fallback to English if not found in requested locale
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(CONTENT_DIR, 'en', `${slug}.md`);
  }

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { meta, body } = parseFrontmatter(fileContents);
  const contentHtml = await marked.parse(body);

  return {
    slug,
    locale: localeDir,
    title: meta.title || slug,
    description: meta.description || '',
    date: meta.date || '2026-09-25',
    author: meta.author || 'TPSH PDF Team',
    coverImage: meta.coverImage || '/images/og-image.png',
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    relatedTools: Array.isArray(meta.relatedTools) ? meta.relatedTools : [],
    readTimeMinutes: calculateReadTime(body),
    contentHtml,
  };
}

/**
 * Get all available post slugs across all locales for generateStaticParams
 */
export function getAllPostSlugs(): { locale: string; slug: string }[] {
  const results: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const localeDir = path.join(CONTENT_DIR, locale);
    const fallbackDir = path.join(CONTENT_DIR, 'en');

    // Use current locale dir if exists, otherwise fallback to en
    const activeDir = fs.existsSync(localeDir) ? localeDir : fallbackDir;

    if (fs.existsSync(activeDir)) {
      const files = fs.readdirSync(activeDir).filter((file) => file.endsWith('.md'));
      for (const file of files) {
        results.push({
          locale,
          slug: file.replace(/\.md$/, ''),
        });
      }
    }
  }

  return results;
}
