'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, FileWarning, DollarSign, Megaphone } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { type Locale } from '@/lib/i18n/config';

interface DisclaimerPageClientProps {
    locale: Locale;
}

export default function DisclaimerPageClient({ locale }: DisclaimerPageClientProps) {
    const t = useTranslations('disclaimer');

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-[hsl(var(--color-primary)/0.1)] via-[hsl(var(--color-background))] to-[hsl(var(--color-secondary)/0.1)] py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-6">
                                <AlertCircle className="h-8 w-8 text-amber-600" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--color-foreground))] mb-6">
                                {t('title')}
                            </h1>
                            <p className="text-lg text-[hsl(var(--color-muted-foreground))]">
                                {t('description')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto prose prose-lg prose-slate dark:prose-invert">
                            <p className="text-lg leading-relaxed mb-8">
                                {t('intro')}
                            </p>

                            {/* Sections */}
                            <div className="space-y-12">
                                {[
                                    { key: 'general', icon: FileWarning },
                                    { key: 'professional', icon: AlertCircle },
                                    { key: 'affiliates', icon: DollarSign },
                                    { key: 'ads', icon: Megaphone }
                                ].map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <div key={section.key} className="border-b border-[hsl(var(--color-border))] pb-8 last:border-0">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-[hsl(var(--color-muted))]">
                                                    <Icon className="w-5 h-5 text-[hsl(var(--color-foreground))]" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] m-0">
                                                    {t(`sections.${section.key}.title`)}
                                                </h2>
                                            </div>
                                            <p className="text-[hsl(var(--color-muted-foreground))] leading-relaxed">
                                                {t(`sections.${section.key}.content`)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
