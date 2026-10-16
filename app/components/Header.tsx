import { Suspense } from 'react';
import { Await, useAsyncValue, useLocation, useNavigation } from 'react-router';
import { type CartViewPayload, useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { useThemeSettings } from '@weaverse/hydrogen';
import type { ThemeSettings } from '~/types/weaverse';
import {Link} from '~/components/ui/link';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({ header, isLoggedIn, cart, publicStoreDomain }: HeaderProps) {
  const { shop, menu } = header;
  const settings = useThemeSettings<ThemeSettings>();

  return (
    <>
      {settings?.topbarText ? (
        <div className='bg-primary px-4 py-2 text-center text-sm text-background'>
          {settings.topbarText}
        </div>
      ) : null}
      <header
        className={`border-b border-muted/30 bg-background ${
          settings?.stickyHeader ? 'sticky top-0 z-40' : ''
        }`}
      >
        <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8'>
          <Link
            className='shrink-0 text-lg font-semibold text-foreground no-underline'
            prefetch='intent'
            to='/'
          >
            <strong>{shop.name}</strong>
          </Link>
          <HeaderMenu
            menu={menu}
            viewport='desktop'
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </header>
    </>
  );
}

export function HeaderMenu({ menu, primaryDomainUrl, viewport, publicStoreDomain }: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className =
    viewport === 'desktop'
      ? 'hidden items-center gap-6 md:flex'
      : 'flex flex-col items-start gap-4';
  const { close } = useAside();
  const location = useLocation();
  const navigation = useNavigation();
  const pendingPath = navigation.location?.pathname;

  return (
    <nav aria-label='Main navigation' className={className} role='navigation'>
      {viewport === 'mobile' && (
        <Link
          onClick={close}
          prefetch='intent'
          to='/'
          className={activeLinkStyle('/', location.pathname, pendingPath)}
        >
          Home
        </Link>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the URL is internal, strip its domain before passing it to the router
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <Link
            className={activeLinkStyle(url, location.pathname, pendingPath)}
            key={item.id}
            onClick={close}
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

function HeaderCtas({ isLoggedIn, cart }: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  const location = useLocation();
  const navigation = useNavigation();
  return (
    <nav
      aria-label='Account and shopping'
      className='flex shrink-0 items-center gap-3 md:gap-5'
      role='navigation'
    >
      <HeaderMenuMobileToggle />
      <Link
        className={activeLinkStyle('/account', location.pathname, navigation.location?.pathname)}
        prefetch='intent'
        to='/account'
      >
        <Suspense fallback='Sign in'>
          <Await resolve={isLoggedIn} errorElement='Sign in'>
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </Link>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button
      aria-label='Open menu'
      className='rounded p-2 text-foreground hover:bg-muted/20 md:hidden'
      onClick={() => open('mobile')}
      type='button'
    >
      <h3 aria-hidden='true'>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const { open } = useAside();
  return (
    <button
      className='rounded px-2 py-1 text-sm text-foreground hover:opacity-70'
      onClick={() => open('search')}
      type='button'
    >
      Search
    </button>
  );
}

function CartBadge({ count }: { count: number }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <Link
      className='inline-flex items-center gap-1 text-sm text-foreground hover:opacity-70'
      to='/cart'
      onClick={(event) => {
        event.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart <span aria-label={`(items: ${count})`}>{count}</span>
    </Link>
  );
}

function CartToggle({ cart }: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
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