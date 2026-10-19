import { useLocation, useRouteLoaderData } from 'react-router';
import type { RootLoader } from '~/root';
import { delocalizePath, localizePath, SUPPORTED_LOCALES } from '~/utils/locale';

export function LocaleSwitcher() {
  const location = useLocation();
  const root = useRouteLoaderData<RootLoader>('root');
  const neutral = delocalizePath(`${location.pathname}${location.search}`);

  return (
    <nav aria-label='Language' className='flex gap-3 text-sm'>
      {SUPPORTED_LOCALES.map((market) => (
        <a
          key={market.hreflang}
          href={localizePath(neutral, market)}
          aria-current={market.pathPrefix === root?.selectedLocale.pathPrefix ? 'true' : undefined}
          className='aria-current:font-bold'
        >
          {market.hreflang}
        </a>
      ))}
    </nav>
  );
}