import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { useLoaderData } from 'react-router';
import type { loader } from '~/routes/collections.$handle';

interface CollectionBannerProps extends HydrogenComponentProps {
  showDescription: boolean;
}

const CollectionBanner = forwardRef<HTMLElement, CollectionBannerProps>((props, ref) => {
  const { showDescription, children, ...rest } = props;
  const { collection } = useLoaderData<typeof loader>();

  return (
    <section ref={ref} {...rest} className='mx-auto w-full max-w-7xl px-4 py-12 md:px-8'>
      <h1 className='text-3xl font-bold'>{collection.title}</h1>
      {showDescription && collection.description && (
        <p className='mt-3 max-w-2xl text-muted'>{collection.description}</p>
      )}
    </section>
  );
});

export default CollectionBanner;

export const schema = createSchema({
  type: 'collection-banner',
  title: 'Collection banner',
  limit: 1,
  enabledOn: { pages: ['COLLECTION'] },
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'switch', name: 'showDescription', label: 'Show description', defaultValue: true },
      ],
    },
  ],
});