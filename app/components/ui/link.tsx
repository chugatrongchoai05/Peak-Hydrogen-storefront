import { forwardRef } from 'react';
import { Link as RouterLink, useRouteLoaderData, type LinkProps } from 'react-router';
import type { RootLoader } from '~/root';
import { DEFAULT_LOCALE, localizePath } from '~/utils/locale';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...props }, ref) {
    const root = useRouteLoaderData<RootLoader>('root');
    const market = root?.selectedLocale ?? DEFAULT_LOCALE;
    return (
        <RouterLink ref={ref} to={typeof to === 'string' ? localizePath(to, market) : to} {...props} />
    );
});