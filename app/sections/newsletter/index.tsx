import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';
import { CONTENT_WIDTH_CLASS, type ContentWidth, contentWidthInput, itemsSpacingInput, VERTICAL_PADDING_CLASS, type VerticalPadding, verticalPaddingInput } from '~/utils/section-layout';

type BackgroundStyle = 'dark' | 'surface' | 'background';

const BACKGROUND_CLASS: Record<BackgroundStyle, string> = {
  dark: 'bg-primary text-white',
  surface: 'bg-surface text-foreground',
  background: 'bg-background text-foreground',
};

interface NewsletterProps extends HydrogenComponentProps {
  backgroundStyle: BackgroundStyle;
  contentWidth: ContentWidth;
  itemsSpacing: number;
  verticalPadding: VerticalPadding;
}

const Newsletter = forwardRef<HTMLElement, NewsletterProps>((props, ref) => {
  const { backgroundStyle, contentWidth, itemsSpacing, verticalPadding, children, ...rest } = props;
  return (
    <section
      ref={ref}
      {...rest}
      className={cn(
        BACKGROUND_CLASS[backgroundStyle] ?? BACKGROUND_CLASS.dark,
        VERTICAL_PADDING_CLASS[verticalPadding] ?? VERTICAL_PADDING_CLASS.large,
      )}
    >
      <div className={CONTENT_WIDTH_CLASS[contentWidth] ?? CONTENT_WIDTH_CLASS.fixed}>
        <div
          className='mx-auto flex max-w-640px flex-wrap justify-center text-center [&_.paragraph]:mx-auto'
          style={{ gap: `${itemsSpacing ?? 16}px` }}
        >
          {children}
        </div>
      </div>
    </section>
  );
});

export default Newsletter;

export const schema = createSchema({
  type: 'newsletter',
  title: 'Newsletter',
  childTypes: ['subheading', 'heading', 'paragraph', 'newsletter-form'],
  settings: [
    {
      group: 'Layout',
      inputs: [contentWidthInput(), itemsSpacingInput(16), verticalPaddingInput('large')],
    },
    {
      group: 'Background',
      inputs: [
        {
          type: 'select',
          name: 'backgroundStyle',
          label: 'Background',
          defaultValue: 'dark',
          configs: {
            options: [
              { value: 'dark', label: 'Dark' },
              { value: 'surface', label: 'Surface' },
              { value: 'background', label: 'Background' },
            ],
          },
          helpText: 'Colors come from Theme settings. Text color follows the background.',
        },
      ],
    },
  ],
  presets: {
    backgroundStyle: 'dark',
    contentWidth: 'fixed',
    itemsSpacing: 16,
    verticalPadding: 'large',
    children: [
      { type: 'subheading', content: 'JOIN THE SQUAD' },
      { type: 'heading', content: 'STAY IN THE GAME.', as: 'h2', weight: 'extrabold' },
      { type: 'paragraph', content: 'Get the latest drops, new arrivals and football-inspired essentials delivered to your inbox.', size: 'large', width: 'medium' },
      { type: 'newsletter-form', placeholder: 'Enter your email address', buttonLabel: 'SIGN ME UP', successMessage: 'You are in! Check your inbox soon.', errorMessage: 'Something went wrong. Please try again.' },
      { type: 'paragraph', content: 'By subscribing, you agree to receive marketing emails. Unsubscribe anytime.', size: 'small', width: 'medium', color: '#A3A3A3' },
    ],
  },
});