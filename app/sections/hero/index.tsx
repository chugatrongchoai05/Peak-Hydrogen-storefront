import { Image } from '@shopify/hydrogen';
import { createSchema, type HydrogenComponentProps, type WeaverseImage } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';

type Height = 'small' | 'medium' | 'large' | 'fullscreen';
type ContentWidth = 'full' | 'stretch' | 'fixed';
type VerticalPadding = 'none' | 'small' | 'medium' | 'large';
type Fit = 'fill' | 'cover' | 'contain';
type Position = 'top left' | 'top center' | 'top right' | 'center left' | 'center center' | 'center right' | 'bottom left' | 'bottom center' | 'bottom right';

const HEIGHT_CLASS: Record<Height, string> = {
  small: 'min-h-[420px] md:min-h-[480px]',
  medium: 'min-h-[480px] md:min-h-[600px]',
  large: 'min-h-[560px] md:min-h-[720px]',
  fullscreen: 'min-h-[100svh]',
};
const VERTICAL_PADDING_CLASS: Record<VerticalPadding, string> = {
  none: 'py-0',
  small: 'py-8 md:py-12',
  medium: 'py-12 md:py-20',
  large: 'py-20 md:py-28',
};
const CONTENT_WIDTH_CLASS: Record<ContentWidth, string> = {
  full: 'w-full px-4',
  stretch: 'w-full px-4 md:px-10 lg:px-16',
  fixed: 'mx-auto w-full max-w-7xl px-4 md:px-8',
};
const VERTICAL_ALIGN_CLASS: Record<string, string> = {
  top: 'justify-start',
  center: 'justify-center',
  bottom: 'justify-end',
};
const HORIZONTAL_ALIGN_CLASS: Record<string, string> = {
  left: 'mr-auto justify-start text-left [&_.paragraph]:mr-auto',
  center: 'mx-auto justify-center text-center [&_.paragraph]:mx-auto',
  right: 'ml-auto justify-end text-right [&_.paragraph]:ml-auto',
};
const FIT_CLASS: Record<Fit, string> = {
  fill: 'object-fill',
  cover: 'object-cover',
  contain: 'object-contain',
};
const POSITION_CLASS: Record<Position, string> = {
  'top left': 'object-left-top',
  'top center': 'object-top',
  'top right': 'object-right-top',
  'center left': 'object-left',
  'center center': 'object-center',
  'center right': 'object-right',
  'bottom left': 'object-left-bottom',
  'bottom center': 'object-bottom',
  'bottom right': 'object-right-bottom',
};

function withWidth(url: string, width: number) {
  return `${url}${url.includes('?') ? '&' : '?'}width=${width}`;
}

interface HeroProps extends HydrogenComponentProps {
  height: Height;
  contentPosition: Position;
  contentWidth: ContentWidth;
  itemsSpacing: number;
  verticalPadding: VerticalPadding;
  backgroundImage?: WeaverseImage;
  mobileBackgroundImage?: WeaverseImage;
  backgroundFit: Fit;
  backgroundPosition: Position;
  enableOverlay: boolean;
  overlayOpacity: number;
}

const Hero = forwardRef<HTMLElement, HeroProps>((props, ref) => {
  const {
    height,
    contentPosition,
    contentWidth,
    itemsSpacing,
    verticalPadding,
    backgroundImage,
    mobileBackgroundImage,
    backgroundFit,
    backgroundPosition,
    enableOverlay,
    overlayOpacity,
    children,
    ...rest
  } = props;

  const [vertical, horizontal] = (contentPosition ?? 'center left').split(' ');
  const opacity = Math.min(100, Math.max(0, overlayOpacity ?? 40)) / 100;

  return (
    <section
      ref={ref}
      {...rest}
      className={cn(
        'relative isolate flex flex-col overflow-hidden bg-primary text-white',
        HEIGHT_CLASS[height] ?? HEIGHT_CLASS.large,
        VERTICAL_PADDING_CLASS[verticalPadding] ?? VERTICAL_PADDING_CLASS.medium,
        VERTICAL_ALIGN_CLASS[vertical] ?? VERTICAL_ALIGN_CLASS.center,
      )}
    >
      {backgroundImage?.url && (
        <picture className='absolute inset-0 z-0 block h-full w-full'>
          {mobileBackgroundImage?.url && (
            <source
              media='(max-width: 767px)'
              srcSet={withWidth(mobileBackgroundImage.url, 1000)}
            />
          )}
          <Image
            data={backgroundImage}
            alt=''
            sizes='100vw'
            loading='eager'
            className={cn(
              'h-full w-full',
              FIT_CLASS[backgroundFit] ?? FIT_CLASS.cover,
              POSITION_CLASS[backgroundPosition] ?? POSITION_CLASS['center center'],
            )}
          />
        </picture>
      )}

      {enableOverlay && (
        <div aria-hidden='true' className='absolute inset-0 z-10 bg-black' style={{ opacity }} />
      )}

      <div className={cn('relative z-20', CONTENT_WIDTH_CLASS[contentWidth] ?? CONTENT_WIDTH_CLASS.fixed)}>
        <div
          className={cn(
            'flex w-full max-w-520px flex-wrap items-center',
            HORIZONTAL_ALIGN_CLASS[horizontal] ?? HORIZONTAL_ALIGN_CLASS.left,
          )}
          style={{ gap: `${itemsSpacing ?? 16}px` }}
        >
          {children}
        </div>
      </div>
    </section>
  );
});

export default Hero;

export const schema = createSchema({
  type: 'hero',
  title: 'Hero',
  childTypes: ['subheading', 'heading', 'paragraph', 'button'],
  enabled: ({ page }) => ['INDEX', 'CUSTOM'].includes(page.type),
  settings: [
    {
      group: 'Layout',
      inputs: [
        {
          type: 'select',
          name: 'height',
          label: 'Section height',
          configs: {
            options: [
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
              { value: 'fullscreen', label: 'Fullscreen' },
            ],
          },
          defaultValue: 'large',
        },
        {
          type: 'position',
          name: 'contentPosition',
          label: 'Content position',
          defaultValue: 'center left',
        },
        {
          type: 'select',
          name: 'contentWidth',
          label: 'Content width',
          defaultValue: 'fixed',
          configs: {
            options: [
              { value: 'full', label: 'Full page' },
              { value: 'stretch', label: 'Stretch' },
              { value: 'fixed', label: 'Fixed' },
            ],
          },
        },
        {
          type: 'range',
          name: 'itemsSpacing',
          label: 'Items spacing',
          defaultValue: 16,
          configs: { min: 0, max: 60, step: 2, unit: 'px' },
        },
        {
          type: 'select',
          name: 'verticalPadding',
          label: 'Vertical padding',
          defaultValue: 'medium',
          configs: {
            options: [
              { value: 'none', label: 'None' },
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ],
          },
        },
      ],
    },
    {
      group: 'Background',
      inputs: [
        { type: 'image', name: 'backgroundImage', label: 'Background image' },
        { type: 'image', name: 'mobileBackgroundImage', label: 'Mobile background image', helpText: 'Optional. A crop for portrait/square screens (up to 767px wide).' },
        {
          type: 'select',
          name: 'backgroundFit',
          label: 'Background fit',
          defaultValue: 'cover',
          configs: {
            options: [
              { value: 'fill', label: 'Fill' },
              { value: 'cover', label: 'Cover' },
              { value: 'contain', label: 'Contain' },
            ],
          },
        },
        { type: 'position', name: 'backgroundPosition', label: 'Background position', defaultValue: 'center center' },
      ],
    },
    {
      group: 'Overlay',
      inputs: [
        { type: 'switch', name: 'enableOverlay', label: 'Enable overlay', defaultValue: true },
        {
          type: 'range',
          name: 'overlayOpacity',
          label: 'Overlay opacity',
          defaultValue: 40,
          configs: { min: 0, max: 100, step: 5, unit: '%' },
          condition: (data) => data.enableOverlay === true,
        },
      ],
    },
  ],
  presets: {
    height: 'large',
    contentPosition: 'center left',
    contentWidth: 'fixed',
    itemsSpacing: 16,
    verticalPadding: 'medium',
    backgroundFit: 'cover',
    backgroundPosition: 'center center',
    enableOverlay: true,
    overlayOpacity: 40,
    children: [
      { type: 'subheading', content: 'BUILT FOR THE BEAUTIFUL GAME' },
      { type: 'heading', content: 'YOUR GAME. YOUR RULES.', as: 'h1', weight: 'extrabold' },
      { type: 'paragraph', content: 'Gear up for every minute, every move, every moment. Discover football jerseys, boots and essentials built for the love of the game.', size: 'large', width: 'medium' },
      { type: 'button', content: 'SHOP JERSEYS', to: '/collections', variant: 'secondary' },
      { type: 'button', content: 'EXPLORE FOOTBALL BOOTS', to: '/collections', variant: 'outline' },
    ],
  },
});