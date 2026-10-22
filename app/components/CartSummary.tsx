import { Money, type OptimisticCart } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const subtotal = cart?.cost?.subtotalAmount;
  return (
    <div
      aria-labelledby='cart-summary'
      className={layout === 'page' ? 'mt-8 border-t border-muted/30 pt-6' : 'border-t border-muted/30 pt-4'}
    >
      <h2 id='cart-summary' className='sr-only'>
        Summary
      </h2>
      <dl className='mb-2 flex items-center justify-between text-base'>
        <dt>Subtotal</dt>
        <dd className='font-semibold'>
          {subtotal?.amount ? (<Money data={subtotal} />) : ('-')}
        </dd>
      </dl>
      <p className='mb-4 text-sm text-muted'>Shipping and taxes are calculated at checkout</p>
      <CheckoutButton checkoutUrl={cart?.checkoutUrl} busy={Boolean(cart?.isOptimistic)} />
    </div>
  );
}

function CheckoutButton({ checkoutUrl, busy }: { checkoutUrl?: string; busy: boolean }) {
  if (!checkoutUrl) return null;
  return (
    <a
      href={checkoutUrl}
      target='_self'
      aria-disabled={busy}
      onClick={(e) => busy && e.preventDefault()}
      className={
        `block w-full rounded px-6 py-3 text-center text-sm font-medium
        transition hover:opacity-90 ${busy ? 'pointer-events-none opacity-50' : ''}`
      }
    >
      Checkout
    </a>
  );
}