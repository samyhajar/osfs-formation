'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="border-t border-accent-primary/10 bg-white/80 backdrop-blur-sm">
      <div className="container px-4 py-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          {/* Left side - OSFS branding */}
          <div className="flex items-center gap-4">
            <p className="text-text-muted">
              {t('copyright')}
            </p>
          </div>

          {/* Right side - Links and developer credit */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <Link
              href="https://osfs.world/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:text-accent-primary/80 transition-colors duration-200 font-medium"
            >
              {t('osfsWorld')}
            </Link>
            <span className="hidden md:inline text-text-muted">•</span>
            <Link
              href="/impressum"
              className="text-accent-primary hover:text-accent-primary/80 transition-colors duration-200 font-medium"
            >
              {t('impressum')}
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}
