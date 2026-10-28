import { Image } from '@shopify/hydrogen';
import { createSchema, type HydrogenComponentProps, useWeaverse, type WeaverseImage } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';
import { CONTENT_WIDTH_CLASS, type ContentWidth, contentWidthInput, itemsSpacingInput, VERTICAL_PADDING_CLASS, type VerticalPadding, verticalPaddingInput } from '~/utils/section-layout';

type ImagePosition = 'left' | 'right';
type AspectRatio = 'auto' | '1/1' | '3/4' | '4/3' | '16/9';
type BackgroundStyle = 'background' | 'surface' | 'dark';
type TextAlignment = 'left' | 'center' | 'right';

const ASPECT_CLASS: Record<AspectRatio, string> = {
    auto: '',
    '1/1': 'aspect-square',
    '3/4': 'aspect-3/4',
    '4/3': 'aspect-4/3',
    '16/9': 'aspect-video',
};
const BACKGROUND_CLASS: Record<BackgroundStyle, string> = {
    background: 'bg-background text-foreground',
    surface: 'bg-surface text-foreground',
    dark: 'bg-primary text-white',
};
const ALIGN_CLASS: Record<TextAlignment, string> = {
    left: 'justify-start text-left [&_.paragraph]:mr-auto',
    center: 'justify-center text-center [&_.paragraph]:mx-auto',
    right: 'justify-end text-right [&_.paragraph]:ml-auto',
};

interface ImageWithTextProps extends HydrogenComponentProps {
    image?: WeaverseImage;
    imagePosition: ImagePosition;
    imageAspectRatio: AspectRatio;
    backgroundStyle: BackgroundStyle;
    textAlignment: TextAlignment;
    contentWidth: ContentWidth;
    itemsSpacing: number;
    verticalPadding: VerticalPadding;
}

const ImageWithText = forwardRef<HTMLElement, ImageWithTextProps>((props, ref) => {
    const { image, imagePosition, imageAspectRatio, backgroundStyle, textAlignment, contentWidth, itemsSpacing, verticalPadding, children, ...rest } = props;
    const { isDesignMode } = useWeaverse();
    const hasImage = Boolean(image?.url);
    const isRight = imagePosition === 'right';
    const aspect = imageAspectRatio ?? '4/3';

    return (
        <section
            ref={ref}
            {...rest}
            className={cn(
                BACKGROUND_CLASS[backgroundStyle] ?? BACKGROUND_CLASS.surface,
                VERTICAL_PADDING_CLASS[verticalPadding] ?? VERTICAL_PADDING_CLASS.medium
            )}
        >
            <div className={CONTENT_WIDTH_CLASS[contentWidth] ?? CONTENT_WIDTH_CLASS.fixed}>
                <div className={cn(
                    'grid grid-cols-1 items-center gap-8 md:gap-16',
                    hasImage || isDesignMode ? 'md:grid-cols-2' : 'md:grid-cols-1'
                )}
                >
                    {hasImage && image ? (
                        <div className={cn(
                            'w-full overflow-hidden', ASPECT_CLASS[aspect] ?? ASPECT_CLASS['4/3'],
                            isRight ? 'md:order-2' : 'md:order-1'
                        )}
                        >
                            <Image
                                data={image}
                                alt={image.altText || ''}
                                sizes='(min-width: 48em) 50vw, 100vw'
                                loading='lazy'
                                className={cn('w-full', aspect === 'auto' ? 'h-auto' : 'h-full object-cover')}
                            />
                        </div>
                    ) : (
                        isDesignMode && (
                            <div className={cn(
                                'flex aspect-4/3 w-full items-center justify-center border border-dashed border-current p-6 text-center text-sm opacity-60',
                                isRight ? 'md:order-2' : 'md:order-1'
                            )}
                            >
                                Choose an image in the section settings.
                            </div>
                        )
                    )}

                    <div
                        className={cn(
                            'flex flex-wrap items-center',
                            ALIGN_CLASS[textAlignment] ?? ALIGN_CLASS.left, isRight ? 'md:order-1' : 'md:order-2'
                        )}
                        style={{ gap: `${itemsSpacing ?? 16}px` }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
});

export default ImageWithText;

export const schema = createSchema({
    type: 'image-with-text',
    title: 'Image with text',
    childTypes: ['subheading', 'heading', 'paragraph', 'button'],
    enabled: ({ page }) => ['INDEX', 'CUSTOM', 'PAGE'].includes(page.type),
    settings: [
        {
            group: 'Layout',
            inputs: [
                {
                    type: 'toggle-group',
                    name: 'imagePosition',
                    label: 'Image position (desktop)',
                    defaultValue: 'left',
                    configs: {
                        options: [
                            { value: 'left', label: 'Left' },
                            { value: 'right', label: 'Right' },
                        ],
                    },
                },
                {
                    type: 'toggle-group',
                    name: 'textAlignment',
                    label: 'Text alignment',
                    defaultValue: 'left',
                    configs: {
                        options: [
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' },
                        ],
                    },
                },
                contentWidthInput(),
                itemsSpacingInput(16),
                verticalPaddingInput(),
            ],
        },
        {
            group: 'Image',
            inputs: [
                { type: 'image', name: 'image', label: 'Image' },
                {
                    type: 'select',
                    name: 'imageAspectRatio',
                    label: 'Image aspect ratio',
                    defaultValue: '4/3',
                    configs: {
                        options: [
                            { value: 'auto', label: 'Adapt to image' },
                            { value: '1/1', label: '1/1' },
                            { value: '3/4', label: '3/4' },
                            { value: '4/3', label: '4/3' },
                            { value: '16/9', label: '16/9' },
                        ],
                    },
                },
            ],
        },
        {
            group: 'Background',
            inputs: [
                {
                    type: 'select',
                    name: 'backgroundStyle',
                    label: 'Background',
                    defaultValue: 'surface',
                    configs: {
                        options: [
                            { value: 'background', label: 'Background (white)' },
                            { value: 'surface', label: 'Surface (concrete)' },
                            { value: 'dark', label: 'Dark (black)' },
                        ],
                    },
                    helpText: 'Colors come from Theme settings. Dark switches the text to white.',
                },
            ],
        },
    ],
    presets: {
        imagePosition: 'left',
        textAlignment: 'left',
        imageAspectRatio: '4/3',
        backgroundStyle: 'surface',
        contentWidth: 'fixed',
        itemsSpacing: 16,
        verticalPadding: 'medium',
        children: [
            { type: 'subheading', content: 'MADE FOR THE MOMENT' },
            { type: 'heading', content: 'FROM KICK-OFF TO THE FINAL WHISTLE.', as: 'h2', weight: 'extrabold' },
            { type: 'paragraph', content: 'Every touch matters. Find the boots, training gear and essentials that keep you ready for the next play.', size: 'large', width: 'medium' },
            { type: 'button', content: 'EXPLORE THE COLLECTION', to: '/collections', variant: 'primary' },
        ],
    },
});