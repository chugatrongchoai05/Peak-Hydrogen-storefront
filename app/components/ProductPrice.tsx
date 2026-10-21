import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({ price, compareAtPrice }: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  if (!price) {
    return <span>&nbsp;</span>;
  }
  if (compareAtPrice) {
    return (
      <div className='flex items-baseline gap-3'>
        <Money data={price} className='font-semibold' />
        <s className='text-base text-muted'>
          <Money data={compareAtPrice} />
        </s>
      </div>
    );
  }
  return <Money data={price} className='font-semibold' />;
}