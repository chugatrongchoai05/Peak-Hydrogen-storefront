import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { useLoaderData } from 'react-router';
import { ProductGrid, type ProductGridConnection } from '~/components/product-grid';
import { ProductListControls } from '~/components/product-list-controls';
import type { ProductListParams } from '~/utils/product-list';

interface ProductGridSectionProps extends HydrogenComponentProps {
  columns: string;
  showSort: boolean;
  showFilters: boolean;
}

const ProductGridSection = forwardRef<HTMLElement, ProductGridSectionProps>((props, ref) => {
  const { columns, showSort, showFilters, children, ...rest } = props;
  const { products, listParams } = useLoaderData() as {
    products: ProductGridConnection;
    listParams: ProductListParams;
  };

  return (
    <section ref={ref} {...rest} className='mx-auto w-full max-w-7xl px-4 pb-16 md:px-8'>
      {(showSort || showFilters) && (
        <ProductListControls params={listParams} showSort={showSort} showFilters={showFilters} />
      )}
      <ProductGrid connection={products} columns={columns} />
    </section>
  );
});

export default ProductGridSection;

export const schema = createSchema({
  type: 'product-grid',
  title: 'Product grid',
  limit: 1,
  enabledOn: { pages: ['COLLECTION', 'ALL_PRODUCTS'] },
  settings: [
    {
      group: 'Layout',
      inputs: [
        {
          type: 'select',
          name: 'columns',
          label: 'Columns (desktop)',
          defaultValue: '4',
          configs: {
            options: [
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ],
          },
        },
      ],
    },
    {
      group: 'Controls',
      inputs: [
        { type: 'switch', name: 'showSort', label: 'Show sort', defaultValue: true },
        { type: 'switch', name: 'showFilters', label: 'Show filters', defaultValue: true },
      ],
    },
  ],
});