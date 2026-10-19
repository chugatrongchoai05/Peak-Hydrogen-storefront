import type { CountryCode, LanguageCode } from '@shopify/hydrogen/storefront-api-types';

export type Market = {
  pathPrefix: string;
  label: string;
  language: LanguageCode;
  country: CountryCode;
  currency: string;
  hreflang: string;
  direction: 'ltr' | 'rtl';
};

export const SUPPORTED_LOCALES: Market[] = [
    {
        pathPrefix: '',
        label: 'United States (USD)',
        language: 'EN',
        country: 'US',
        currency: 'USD',
        hreflang: 'en-US',
        direction: 'ltr',
    },
    {
        pathPrefix: '/de-de',
        label: 'Germany (EUR)',
        language: 'DE',
        country: 'DE',
        currency: 'EUR',
        hreflang: 'de-DE',
        direction: 'ltr',
    },
] as const;

export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0];

const LOCALE_SHAPE = /^[a-z]{2}-[a-z]{2}$/i;

function firstSegment(pathname: string) {
  return (pathname.split('/')[1] ?? '').replace(/\.data$/, '');
}

// chỉ trả về market đã cấu hình
export function getMarketFromPath(pathname: string): Market | undefined {
  const segment = firstSegment(pathname).toLowerCase();
  return SUPPORTED_LOCALES.find((m) => 
    m.pathPrefix !== '' && m.pathPrefix.slice(1).toLowerCase() === segment,
  );
}

export function resolveMarket(request: Request): Market {
  return getMarketFromPath(new URL(request.url).pathname) ?? DEFAULT_LOCALE;
}

// không đc cấu hình
export function isUnsupportedMarketPath(pathname: string): boolean {
  return LOCALE_SHAPE.test(firstSegment(pathname)) && !getMarketFromPath(pathname);
}

export function delocalizePath(path: string): string {
  const market = getMarketFromPath(path.split(/[?#]/)[0]);
  if (!market) return path;
  const rest = path.slice(market.pathPrefix.length);
  return rest.startsWith('/') ? rest : `/${rest}`;
}

export function localizePath(path: string, market: Market): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path; // link ngoài
  const neutral = delocalizePath(path);
  if (!market.pathPrefix) return neutral;
  return neutral === '/' ? market.pathPrefix : `${market.pathPrefix}${neutral}`;
}