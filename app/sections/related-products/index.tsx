import { Await, useLoaderData } from 'react-router';
import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef, Suspense, type ComponentProps } from 'react';
import { ProductCard } from '~/components/product-card';
import type { loader } from '~/routes/($locale).products.$handle';

interface RelatedProductsProps extends HydrogenComponentProps {
  heading: string;
}

const RelatedProducts = forwardRef<HTMLElement, RelatedProductsProps>((props, ref) => {
  const { heading, children, ...rest } = props;
  const { recommendations } = useLoaderData<typeof loader>();

  return (
    <section ref={ref} {...rest} className='mx-auto w-full max-w-7xl px-4 py-12 md:px-8'>
      <Suspense fallback={null}>
        <Await resolve={recommendations}>
          {(data) => {
            const items = data?.productRecommendations?.slice(0, 4) ?? [];
            if (items.length === 0) return null;
            return (
              <>
                <h2 className='mb-6 text-2xl font-bold'>{heading}</h2>
                <div className='grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4'>
                  {items.map((product: ComponentProps<typeof ProductCard>['product']) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
});

export default RelatedProducts;

export const schema = createSchema({
  type: 'related-products',
  title: 'Related products',
  limit: 1,
  enabledOn: { pages: ['PRODUCT'] },
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'text', name: 'heading', label: 'Heading', defaultValue: 'You may also like' },
      ],
    },
  ],
});