import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from '~/components/ui/link';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';

export type CartLayout = 'page' | 'aside';

export function CartMain({ layout, cart: originalCart }: {
  layout: CartLayout;
  cart: CartApiQueryFragment | null;
}) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  return (
    <div>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div>
        <div aria-labelledby='cart-lines'>
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({ hidden = false, layout = 'aside' }: {
  hidden: boolean;
  layout?: CartLayout;
}) {
  const { close } = useAside();
  return (
    <div hidden={hidden} className='py-8 text-center'>
      <p className='mb-4'>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you started!
      </p>
      <Link
        to='/collections'
        onClick={layout === 'aside' ? close : undefined}
        prefetch='viewport'
        className='underline'
      >
        Continue shopping →
      </Link>
    </div>
  );
}