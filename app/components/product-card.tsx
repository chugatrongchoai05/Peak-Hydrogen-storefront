import { Image, Money } from '@shopify/hydrogen';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { Link } from '~/components/ui/link';

export function ProductCard({ product, loading }: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const { handle, title, featuredImage, priceRange } = product;
  return (
    <Link to={`/products/${handle}`} prefetch='intent' className='group block'>
      <div className='aspect-square overflow-hidden bg-muted/10'>
        {featuredImage && (
          <Image
            data={featuredImage}
            alt={featuredImage.altText || title}
            aspectRatio='1/1'
            sizes='(min-width: 45em) 25vw, 50vw'
            loading={loading}
            className='h-full w-full object-cover transition group-hover:scale-105'
          />
        )}
      </div>
      <h3 className='mt-3 text-sm font-medium'>{title}</h3>
      <Money data={priceRange.minVariantPrice} className='text-sm text-muted' />
    </Link>
  );
}