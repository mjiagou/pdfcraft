import React from 'react';
import Link from 'next/link';
import { getToolById } from '@/config/tools';
import { getToolContent } from '@/config/tool-content';
import { type Locale } from '@/lib/i18n/config';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface RelatedToolsCTAProps {
  toolIds: string[];
  locale: Locale;
}

export const RelatedToolsCTA: React.FC<RelatedToolsCTAProps> = ({ toolIds, locale }) => {
  if (!toolIds || toolIds.length === 0) return null;

  const validTools = toolIds.flatMap((id) => {
    const tool = getToolById(id);
    const content = getToolContent(locale, id);
    if (!tool || !content) return [];
    return [{ tool, content }];
  });

  if (validTools.length === 0) return null;

  const isZh = locale.startsWith('zh');

  return (
    <div className="my-12 rounded-2xl border border-[hsl(var(--color-primary))/0.3] bg-linear-to-br from-[hsl(var(--color-primary))/0.05] via-background to-[hsl(var(--color-accent))/0.05] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 text-[hsl(var(--color-primary))] font-semibold text-sm mb-3">
        <Sparkles className="w-4 h-4" />
        <span>{isZh ? '本文推荐的免费在线工具' : 'Recommended Free In-Browser Tools'}</span>
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
        {isZh ? '无需安装任何软件，在浏览器中一键开始' : 'Try These Tools Directly in Your Browser'}
      </h3>

      <p className="text-muted-foreground text-sm mb-6 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          {isZh
            ? '100% 浏览器本地运算，文件不离开您的电脑，零泄露风险。'
            : '100% client-side WebAssembly processing. Zero file uploads, maximum privacy.'}
        </span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {validTools.map(({ tool, content }) => (
          <Link
            key={tool.id}
            href={`/${locale}/tools/${tool.slug}`}
            className="group relative flex flex-col justify-between p-5 rounded-xl border border-border bg-card/60 hover:bg-card hover:border-[hsl(var(--color-primary))] hover:shadow-md transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-foreground group-hover:text-[hsl(var(--color-primary))] transition-colors text-base line-clamp-1">
                  {content.title}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                  {isZh ? '免费使用' : 'Free'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                {content.metaDescription}
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-1 transition-transform">
              <span>{isZh ? '立即进入工具' : 'Launch Tool Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
