import { Link as RouterLink, useRouteLoaderData, type LinkProps } from 'react-router';
import type { RootLoader } from '~/root';
import { DEFAULT_LOCALE, localizePath } from '~/utils/locale';

export function Link ({ to, ...props }: LinkProps) {
    const root = useRouteLoaderData<RootLoader>('root');
    const market = root?.selectedLocale ?? DEFAULT_LOCALE;
    return (
        <RouterLink to={typeof to === 'string' ? localizePath(to, market): to} {...props} />
    );
}