import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';

const localeMap = locales.reduce((acc, locale) => {
  acc[locale.toLowerCase()] = locale;
  return acc;
}, {});

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);
  const currentLocaleSegment = segments[0];

  if (currentLocaleSegment) {
    const matchedLocale = localeMap[currentLocaleSegment.toLowerCase()];

    if (matchedLocale) {
      // Canonicalize locale casing to avoid duplicate prefixes like /pt-BR/pt-br/...
      if (matchedLocale !== currentLocaleSegment) {
        segments[0] = matchedLocale;
        const hasTrailingSlash = pathname.endsWith('/') && pathname !== '/';
        const canonicalPath = `/${segments.join('/')}${hasTrailingSlash ? '/' : ''}`;
        request.nextUrl.pathname = canonicalPath || '/';
        return NextResponse.redirect(request.nextUrl);
      }

      return NextResponse.next();
    }
  }

  // Redirect to default locale if no locale in pathname
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, assets)
    '/((?!_next|api|.*\\.).*)',
  ],
};
