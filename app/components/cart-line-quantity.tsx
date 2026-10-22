import { CartForm, type OptimisticCartLine } from '@shopify/hydrogen';
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useCartRoute } from '~/utils/use-cart-route';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

const stepButton = 'flex h-9 w-9 items-center justify-center text-lg transition hover:bg-muted/10 disabled:cursor-not-allowed disabled:opacity-40';

export function CartLineQuantity({ line }: { line: CartLine }) {
  const cartRoute = useCartRoute();
  const { id: lineId, quantity, isOptimistic } = line;
  const pending = Boolean(isOptimistic);
  return (
    <div className='flex items-center gap-4'>
      <div className='flex items-center border border-muted/40'>
        <UpdateButton
          route={cartRoute}
          lines={[{ id: lineId, quantity: Math.max(0, quantity - 1) }]}
          label='Decrease quantity'
          disabled={quantity <= 1 || pending}
        >
          <span aria-hidden='true'>&#8722;</span>
        </UpdateButton>
        <span className='min-w-8 text-center text-sm' aria-live='polite'>
          {quantity}
        </span>
        <UpdateButton
          route={cartRoute}
          lines={[{ id: lineId, quantity: quantity + 1 }]}
          label='Increase quantity'
          disabled={pending}
        >
          <span aria-hidden='true'>&#43;</span>
        </UpdateButton>
      </div>

      <CartForm
        fetcherKey={`remove-${lineId}`}
        route={cartRoute}
        action={CartForm.ACTIONS.LinesRemove}
        inputs={{ lineIds: [lineId] }}
      >
        <button type='submit' disabled={pending} className='text-sm underline disabled:opacity-40'>
          Remove
        </button>
      </CartForm>
    </div>
  );
}

function UpdateButton({ route, lines, label, disabled, children }: {
  route: string;
  lines: CartLineUpdateInput[];
  label: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm
      fetcherKey={[CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-')}
      route={route}
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      <button type='submit' aria-label={label} disabled={disabled} className={stepButton}>
        {children}
      </button>
    </CartForm>
  );
}