import { Suspense } from 'react';
import { Await, useLocation, useNavigation } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { Link } from '~/components/ui/link';
import { useThemeSettings } from '@weaverse/hydrogen';
import type { ThemeSettings } from '~/types/weaverse';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const settings = useThemeSettings<ThemeSettings>();
  return (
    <footer className='border-t border-muted/30 bg-background text-foreground'>
      <div className='mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1fr_auto] md:items-start md:px-8'>
        <Suspense fallback={<div className='text-sm text-muted'>Loading footer...</div>}>
          <Await resolve={footerPromise}>
            {(footer) =>
              footer?.menu && header.shop.primaryDomain?.url ? (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              ) : null
            }
          </Await>
        </Suspense>
        {settings?.copyright ? (
          <p className='text-sm text-muted md:text-right'>{settings.copyright}</p>
        ) : null}
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const location = useLocation();
  const navigation = useNavigation();

  return (
    <nav
      aria-label='Footer navigation'
      className='flex flex-wrap gap-x-6 gap-y-3'
      role='navigation'
    >
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a
            className='text-sm text-foreground transition-opacity hover:opacity-70'
            href={url}
            key={item.id}
            rel='noopener noreferrer'
            target='_blank'
          >
            {item.title}
          </a>
        ) : (
          <Link
            className={activeLinkStyle(url, location.pathname, navigation.location?.pathname)}
            key={item.id}
            prefetch='intent'
            to={url}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle(to: string, pathname: string, pendingPathname?: string) {
  return [
    'text-sm text-foreground transition-opacity hover:opacity-70',
    pathname === to ? 'font-semibold underline underline-offset-4' : '',
    pendingPathname === to ? 'opacity-60' : '',
  ]
    .filter(Boolean)
    .join(' ');
}