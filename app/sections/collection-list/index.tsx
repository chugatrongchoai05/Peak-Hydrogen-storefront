import { Image, Pagination } from '@shopify/hydrogen';
import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { useLoaderData } from 'react-router';
import { Link } from '~/components/ui/link';
import type { loader } from '~/routes/collections._index';

const COLUMN_CLASS: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
};

interface CollectionListProps extends HydrogenComponentProps {
  heading: string;
  columns: string;
}

const CollectionList = forwardRef<HTMLElement, CollectionListProps>((props, ref) => {
  const { heading, columns, children, ...rest } = props;
  const { collections } = useLoaderData<typeof loader>();
  return (
    <section ref={ref} {...rest} className='mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16'>
      <h1 className='mb-8 text-3xl font-bold'>{heading}</h1>
      <Pagination connection={collections}>
        {({ nodes, isLoading, PreviousLink, NextLink }) => (
          <div>
            <PreviousLink>{isLoading ? 'Loading...' : 'Load previous'}</PreviousLink>
            <div className={`grid grid-cols-2 gap-6 ${COLUMN_CLASS[columns] ?? COLUMN_CLASS['3']}`}>
              {nodes.map((collection) => (
                <Link key={collection.id} to={`/collections/${collection.handle}`} className='group block'>
                  <div className='aspect-4/3 overflow-hidden bg-muted/10'>
                    {collection.image && (
                      <Image
                        data={collection.image}
                        alt={collection.image.altText || collection.title}
                        aspectRatio='4/3'
                        sizes='(min-width: 45em) 33vw, 50vw'
                        className='h-full w-full object-cover transition group-hover:scale-105'
                      />
                    )}
                  </div>
                  <h2 className='mt-3 text-lg font-medium'>{collection.title}</h2>
                </Link>
              ))}
            </div>
            <NextLink>{isLoading ? 'Loading...' : 'Load more'}</NextLink>
          </div>
        )}
      </Pagination>
    </section>
  );
});

export default CollectionList;

export const schema = createSchema({
  type: 'collection-list',
  title: 'Collection list',
  limit: 1,
  enabledOn: { pages: ['COLLECTION_LIST'] },
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'text', name: 'heading', label: 'Heading', defaultValue: 'Collections' },
      ],
    },
    {
      group: 'Layout',
      inputs: [
        {
          type: 'select',
          name: 'columns',
          label: 'Columns (desktop)',
          defaultValue: '3',
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
  ],
});