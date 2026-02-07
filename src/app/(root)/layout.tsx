import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDFtpsh - Professional PDF Tools',
  description: 'Free online PDF tools for merging, splitting, compressing, and converting PDF files.',
};

export default function RedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
