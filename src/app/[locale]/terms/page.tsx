import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import TermsPageClient from './TermsPageClient';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'terms' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

interface TermsPageProps {
    params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    return <TermsPageClient locale={locale as Locale} />;
}
