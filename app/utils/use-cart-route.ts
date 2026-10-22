import { useRouteLoaderData } from 'react-router';
import type { RootLoader } from '~/root';
import { DEFAULT_LOCALE, localizePath } from '~/utils/locale';

export function useCartRoute() {
  const root = useRouteLoaderData<RootLoader>('root');
  return localizePath('/cart', root?.selectedLocale ?? DEFAULT_LOCALE);
}