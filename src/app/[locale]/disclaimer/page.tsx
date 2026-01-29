import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import DisclaimerPageClient from './DisclaimerPageClient';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'disclaimer' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

interface DisclaimerPageProps {
    params: Promise<{ locale: string }>;
}

export default async function DisclaimerPage({ params }: DisclaimerPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    return <DisclaimerPageClient locale={locale as Locale} />;
}
