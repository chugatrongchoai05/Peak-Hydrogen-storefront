import { useNavigate } from 'react-router';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type { Maybe, ProductOptionValueSwatch } from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import type { ProductFragment } from 'storefrontapi.generated';
import { Link } from '~/components/ui/link';

const optionBase = 'inline-flex min-w-12 items-center justify-center border px-4 py-2 text-sm transition';
function optionClass(selected: boolean, available: boolean, exists: boolean) {
  return [
    optionBase,
    selected ? 'border-foreground' : 'border-muted/40 hover:border-foreground',
    available ? '' : 'opacity-40',
    exists ? '' : 'cursor-not-allowed line-through',
  ].join(' ');
}

export function ProductForm({ productOptions, selectedVariant }: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  return (
    <div className='space-y-6'>
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;
        const selectedName = option.optionValues.find((value) => value.selected)?.name;

        return (
          <div key={option.name}>
            <p className='mb-2 text-sm font-medium'>
              {option.name}
              {selectedName && <span className='ml-1 text-muted'>: {selectedName}</span>}
            </p>
            <div className='flex flex-wrap gap-2'>
              {option.optionValues.map((value) => {
                const { name, handle, variantUriQuery, selected, available, exists, isDifferentProduct, swatch } = value;
                const className = optionClass(selected, available, exists);

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product that leads to a different url, we need to render it as an anchor tag
                  return (
                    <Link
                      key={option.name + name}
                      to={`/products/${handle}?${variantUriQuery}`}
                      prefetch='intent'
                      preventScrollReset
                      replace
                      aria-current={selected ? 'true' : undefined}
                      className={className}
                    >
                      <OptionLabel swatch={swatch} name={name} />
                    </Link>
                  );
                }
                return (
                  <button
                    key={option.name + name}
                    type='button'
                    disabled={!exists}
                    aria-pressed={selected}
                    className={className}
                    onClick={() => {
                      if (!selected) void navigate(`?${variantUriQuery}`, { replace: true, preventScrollReset: true });
                    }}
                  >
                    <OptionLabel swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1, selectedVariant }] : []}
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function OptionLabel({ swatch, name }: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <>{name}</>;

  return (
    <span
      aria-label={name}
      className='block h-6 w-6 overflow-hidden rounded-full border border-muted/40'
      style={{ backgroundColor: color || 'transparent' }}
    >
      {image && <img src={image} alt={name} className='h-full w-full object-cover' />}
    </span>
  );
}