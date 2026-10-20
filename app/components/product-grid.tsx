import { Pagination } from '@shopify/hydrogen';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { ProductCard } from '~/components/product-card';

export type ProductGridConnection = React.ComponentProps<
    typeof Pagination<ProductItemFragment>
>['connection'];

const COLUMN_CLASS: Record<string, string> = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-4',
};

export function ProductGrid({ connection, columns = '4' }: {
    connection: ProductGridConnection;
    columns?: string;
}) {
    return (
        <Pagination connection={connection}>
            {({ nodes, isLoading, PreviousLink, NextLink }) =>
                nodes.length === 0 ? (
                    <p className='py-12 text-center text-muted'>No products match your filters.</p>
                ) : (
                    <div>
                        <PreviousLink className='mb-4 block text-center text-sm underline'>
                            {isLoading ? 'Loading...' : 'Load previous'}
                        </PreviousLink>
                        <div className={`grid grid-cols-2 gap-x-4 gap-y-8 ${COLUMN_CLASS[columns] ?? COLUMN_CLASS['4']}`}>
                            {nodes.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    loading={index < 4 ? 'eager' : 'lazy'}
                                />
                            ))}
                        </div>
                        <NextLink className='mt-8 block text-center text-sm underline'>
                            {isLoading ? 'Loading...' : 'Load more'}
                        </NextLink>
                    </div>
                )
            }
        </Pagination>
    );
}