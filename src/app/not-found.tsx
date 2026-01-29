import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))]">
            <div className="text-center space-y-6 p-4">
                <h1 className="text-9xl font-bold text-[hsl(var(--color-primary)/0.2)]">404</h1>
                <h2 className="text-3xl font-bold">Page Not Found</h2>
                <p className="text-[hsl(var(--color-muted-foreground))] max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <div className="pt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[hsl(var(--color-primary))] rounded-xl hover:bg-[hsl(var(--color-primary-hover))] transition-colors shadow-lg hover:shadow-primary/25"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
