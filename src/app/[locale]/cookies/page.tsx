import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import CookiesPageClient from './CookiesPageClient';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'cookies' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

interface CookiesPageProps {
    params: Promise<{ locale: string }>;
}

export default async function CookiesPage({ params }: CookiesPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    return <CookiesPageClient locale={locale as Locale} />;
}
