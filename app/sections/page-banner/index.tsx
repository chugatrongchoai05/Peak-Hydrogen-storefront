import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';

interface PageBannerProps extends HydrogenComponentProps {
  heading: string;
  description: string;
}

const PageBanner = forwardRef<HTMLElement, PageBannerProps>((props, ref) => {
  const { heading, description, children, ...rest } = props;
  return (
    <section ref={ref} {...rest} className='mx-auto w-full max-w-7xl px-4 py-12 md:px-8'>
      <h1 className='text-3xl font-bold'>{heading}</h1>
      {description && <p className='mt-3 max-w-2xl text-muted'>{description}</p>}
    </section>
  );
});

export default PageBanner;

export const schema = createSchema({
  type: 'page-banner',
  title: 'Page banner',
  limit: 1,
  enabledOn: { pages: ['ALL_PRODUCTS'] },
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'text', name: 'heading', label: 'Heading', defaultValue: 'All products' },
        { type: 'textarea', name: 'description', label: 'Description', defaultValue: 'Browse our full catalog.' },
      ],
    },
  ],
});