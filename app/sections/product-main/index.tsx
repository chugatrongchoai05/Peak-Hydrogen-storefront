import { Analytics, getAdjacentAndFirstAvailableVariants, getProductOptions, useOptimisticVariant, useSelectedOptionInUrlParam } from '@shopify/hydrogen';
import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { useLoaderData } from 'react-router';
import { ProductForm } from '~/components/ProductForm';
import { ProductGallery } from '~/components/product-gallery';
import { ProductPrice } from '~/components/ProductPrice';
import type { loader } from '~/routes/($locale).products.$handle';

interface ProductMainProps extends HydrogenComponentProps {
  showVendor: boolean;
  showDescription: boolean;
}

const ProductMain = forwardRef<HTMLElement, ProductMainProps>((props, ref) => {
  const { showVendor, showDescription, children, ...rest } = props;
  const { product } = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });
  const { title, vendor, descriptionHtml } = product;

  return (
    <section
      ref={ref} {...rest}
      className='mx-auto grid w-full max-w-7xl gap-10 px-4 py-8 md:grid-cols-2 md:px-8 md:py-12'
    >
      <ProductGallery
        images={product.images.nodes}
        selectedImageId={selectedVariant?.image?.id}
        title={title}
      />
      <div>
        {showVendor && vendor && (
          <p className='text-sm uppercase tracking-wide text-muted'>{vendor}</p>
        )}
        <h1 className='mt-1 text-3xl font-bold'>{title}</h1>
        {/* Yotpo: rating dưới tiêu đề */}
        <div className='mt-4 text-xl'>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
        </div>
        {/* Recharge: chọn selling plan, đặt trước form */}
        <div className='mt-6'>
          <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} />
          {/* Swym: nút wishlist cạnh nút thêm vào giỏ */}
        </div>
        {showDescription && descriptionHtml && (
          <details open className='mt-8 border-t border-muted/30 pt-4'>
            <summary className='cursor-pointer font-medium'>Description</summary>
            <div className='mt-3 space-y-3 text-sm' dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </details>
        )}
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </section>
  );
});

export default ProductMain;

export const schema = createSchema({
  type: 'product-main',
  title: 'Product main',
  limit: 1,
  enabledOn: { pages: ['PRODUCT'] },
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'switch', name: 'showVendor', label: 'Show vendor', defaultValue: true },
        { type: 'switch', name: 'showDescription', label: 'Show description', defaultValue: true },
      ],
    },
  ],
});