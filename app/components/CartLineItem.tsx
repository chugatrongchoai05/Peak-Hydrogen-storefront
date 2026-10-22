import { Image, type OptimisticCartLine } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import type { CartLayout } from '~/components/CartMain';
import { CartLineQuantity } from '~/components/cart-line-quantity';
import { ProductPrice } from '~/components/ProductPrice';
import { Link } from '~/components/ui/link';
import { useVariantUrl } from '~/lib/variants';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({ layout, line }: { layout: CartLayout; line: CartLine }) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();

  return (
    <li key={id} className='flex gap-4 border-b border-muted/30 py-4'>
      {image && (
        <Image
          alt={title}
          aspectRatio='1/1'
          data={image}
          height={100}
          width={100}
          loading='lazy'
          className='h-24 w-24 shrink-0 object-cover'
        />
      )}
      <div className='flex min-w-0 flex-1 flex-col gap-2'>
        <div className='flex justify-between gap-4'>
          <Link
            prefetch='intent'
            to={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
            className='font-medium hover:underline'
          >
            {product.title}
          </Link>
          <span className='text-sm'>
            <ProductPrice price={line?.cost?.totalAmount} />
          </span>
        </div>
        <ul className='text-sm text-muted'>
          {selectedOptions.map((option) => (
            <li key={option.name}>{option.name}: {option.value}</li>
          ))}
        </ul>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}