'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, localeNames } from '../lib/i18n';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher({ currentLocale }) {
  const pathname = usePathname();

  // Remove current locale from pathname to get base path
  const getPathWithoutLocale = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (locales.includes(segments[0])) {
      segments.shift();
    }
    return segments.join('/');
  };

  const basePath = getPathWithoutLocale();

  return (
    <div className={styles.languageSwitcher}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${basePath ? `/${basePath}` : ''}`}
          className={`${styles.languageLink} ${locale === currentLocale ? styles.active : ''}`}
          aria-label={`Switch to ${localeNames[locale]}`}
          aria-current={locale === currentLocale ? 'true' : undefined}
        >
          {localeNames[locale]}
        </Link>
      ))}
    </div>
  );
}
