import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { type Locale } from '@/lib/i18n/config';

interface LinkItem {
    title: string;
    description: string;
    url: string;
    icon?: string;
}

export default async function LinksPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'linksPage' });

    // Specific links for this demo - could be moved to config later
    const links: LinkItem[] = [
        {
            title: 'Next.js',
            description: 'The React Framework for the Web',
            url: 'https://nextjs.org',
            icon: '▲',
        },
        {
            title: 'Tailwind CSS',
            description: 'Rapidly build modern websites without ever leaving your HTML.',
            url: 'https://tailwindcss.com',
            icon: '🌊',
        },
        {
            title: 'Vercel',
            description: 'Develop. Preview. Ship. For the best frontend teams.',
            url: 'https://vercel.com',
            icon: '▲',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[hsl(var(--color-background))]">
            <Header locale={locale} />

            <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--color-foreground))]">
                            {t('title')}
                        </h1>
                        <p className="text-[hsl(var(--color-muted-foreground))]">
                            {t('description')}
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {links.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block p-6 rounded-2xl bg-[hsl(var(--color-card))] border border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[hsl(var(--color-primary)/0.1)] text-2xl group-hover:scale-110 transition-transform">
                                        {link.icon || '🔗'}
                                    </div>
                                    <div className="p-1.5 rounded-full bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] group-hover:bg-[hsl(var(--color-primary))] group-hover:text-white transition-colors">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--color-foreground))] group-hover:text-[hsl(var(--color-primary))] transition-colors">
                                    {link.title}
                                </h3>
                                <p className="text-sm text-[hsl(var(--color-muted-foreground))] line-clamp-2">
                                    {link.description}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
