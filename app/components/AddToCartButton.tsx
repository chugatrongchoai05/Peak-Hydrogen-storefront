import { type FetcherWithComponents } from 'react-router';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { useCartRoute } from '~/utils/use-cart-route';

export function AddToCartButton({ analytics, children, className = '', disabled, lines, onClick}: {
  analytics?: unknown;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  const cartRoute = useCartRoute();
  return (
    <CartForm route={cartRoute} inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input name='analytics' type='hidden' value={JSON.stringify(analytics)} />
          <button
            type='submit'
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={`
              inline-flex w-full items-center justify-center rounded bg-primary
              px-6 py-3 text-sm font-medium text-background transition hover:opacity-90
              disabled:cursor-not-allowed disabled:opacity-50 ${className}
              `}
          >
            {fetcher.state !== 'idle' ? 'Adding...' : children}
          </button>
        </>
      )}
    </CartForm>
  );
}