import { Image } from '@shopify/hydrogen';
import { createSchema, type HydrogenComponentProps, useParentInstance, useWeaverse } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { Link } from '~/components/ui/link';
import { cn } from '~/utils/cn';
import type { FeaturedCollectionItem } from './index';

const GRID_CLASS: Record<string, string> = {
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
  '4': 'lg:grid-cols-4',
};

interface CollectionItemsProps extends HydrogenComponentProps {
  gridColumns: string;
  itemsGap: number;
}

const CollectionItems = forwardRef<HTMLDivElement, CollectionItemsProps>((props, ref) => {
  const { gridColumns, itemsGap, children, ...rest } = props;
  const parent = useParentInstance();
  const { isDesignMode } = useWeaverse();
  const collections = (parent?.data?.loaderData as { collections?: FeaturedCollectionItem[] } | undefined)?.collections ?? [];
  if (collections.length === 0) {
    return (
      <div ref={ref} {...rest} className='w-full'>
        {isDesignMode && (
          <p className='border border-dashed border-muted/60 p-8 text-center text-sm text-muted'>
            Select collections in the “Featured collection” settings to show them here.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...rest}
      className={cn('grid w-full grid-cols-1 sm:grid-cols-2', GRID_CLASS[gridColumns] ?? GRID_CLASS['4'])}
      style={{ gap: `${itemsGap ?? 24}px` }}
    >
      {collections.map((collection) => (
        <Link
          key={collection.id}
          to={`/collections/${collection.handle}`}
          prefetch='intent'
          className='group block'
        >
          <div className='aspect-3/4 overflow-hidden bg-surface'>
            {collection.image?.url && (
              <Image
                data={collection.image}
                alt={collection.image.altText || collection.title}
                aspectRatio='3/4'
                sizes='(min-width: 64em) 25vw, (min-width: 40em) 50vw, 100vw'
                className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
              />
            )}
          </div>
          <h3 className='flex justify-center items-center mt-3 font-heading text-xl font-bold leading-tight md:text-2xl'>
            {collection.title}
          </h3>
        </Link>
      ))}
    </div>
  );
});

export default CollectionItems;

export const schema = createSchema({
  type: 'collection-items',
  title: 'Collection items',
  limit: 1,
  settings: [
    {
      group: 'Layout',
      inputs: [
        {
          type: 'select',
          name: 'gridColumns',
          label: 'Grid columns (desktop)',
          defaultValue: '4',
          configs: {
            options: [
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ],
          },
        },
        {
          type: 'range',
          name: 'itemsGap',
          label: 'Items gap',
          defaultValue: 24,
          configs: { min: 0, max: 60, step: 2, unit: 'px' },
        },
      ],
    },
  ],
});