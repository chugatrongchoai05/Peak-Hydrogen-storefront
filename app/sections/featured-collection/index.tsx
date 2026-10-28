import { type ComponentLoaderArgs, createSchema, type HydrogenComponentProps, useWeaverse, type WeaverseCollection } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';
import { CONTENT_WIDTH_CLASS, type ContentWidth, contentWidthInput, itemsSpacingInput, VERTICAL_PADDING_CLASS, type VerticalPadding, verticalPaddingInput } from '~/utils/section-layout';

export type FeaturedCollectionItem = {
    id: string;
    handle: string;
    title: string;
    image?: {
        id?: string | null;
        url: string;
        altText?: string | null;
        width?: number | null;
        height?: number | null;
    } | null;
};

type LoaderData = { collections: FeaturedCollectionItem[] };
interface FeaturedCollectionData { collections?: WeaverseCollection[] };

const MAX_COLLECTIONS = 12;

export const loader = async ({ weaverse, data }: ComponentLoaderArgs<FeaturedCollectionData>): Promise<LoaderData> => {
    const handles = (data?.collections ?? [])
        .map((c) => c?.handle)
        .filter((h): h is string => Boolean(h))
        .slice(0, MAX_COLLECTIONS);

    // chưa chọn collection nào thì không truy vấn gì
    if (handles.length === 0) return { collections: [] };

    const { storefront } = weaverse;
    const variableDefs = handles.map((_, i) => `$h${i}: String!`).join(', ');
    const selections = handles
        .map((_, i) => `c${i}: collection(handle: $h${i}) { ...FeaturedCollectionFields }`)
        .join('\n');
    // Không dùng thẻ #graphql vì truy vấn được dựng động (codegen không phân tích được)
    const query = `
    query FeaturedCollections(${variableDefs}, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      ${selections}
    }
    fragment FeaturedCollectionFields on Collection {
      id
      handle
      title
      image { id url altText width height }
    }
  `;
    const variables: Record<string, unknown> = {
        country: storefront.i18n.country,
        language: storefront.i18n.language,
    };
    handles.forEach((handle, i) => { variables[`h${i}`] = handle });

    try {
        const result = await storefront.query<Record<string, FeaturedCollectionItem | null>>(query, { variables });
        // giữ đúng thứ tự merchant chọn, bỏ qua collection không tồn tại
        const collections = handles
            .map((_, i) => result?.[`c${i}`])
            .filter((c): c is FeaturedCollectionItem => Boolean(c));
        return { collections };
    } catch (error) {
        console.error('Featured collection loader failed:', error);
        return { collections: [] };
    }
};

interface FeaturedCollectionProps extends HydrogenComponentProps<LoaderData>, FeaturedCollectionData {
    contentWidth: ContentWidth;
    itemsSpacing: number;
    verticalPadding: VerticalPadding;
}

const FeaturedCollection = forwardRef<HTMLElement, FeaturedCollectionProps>((props, ref) => {
    const { contentWidth, itemsSpacing, verticalPadding, collections: _selected, loaderData, children, ...rest } = props;
    const { isDesignMode } = useWeaverse();
    const hasCollections = (loaderData?.collections?.length ?? 0) > 0;
    if (!hasCollections && !isDesignMode) return null;
    return (
        <section
            ref={ref}
            {...rest}
            className={cn('bg-background', VERTICAL_PADDING_CLASS[verticalPadding] ?? VERTICAL_PADDING_CLASS.medium)}
        >
            <div className={CONTENT_WIDTH_CLASS[contentWidth] ?? CONTENT_WIDTH_CLASS.fixed}>
                <div className='flex flex-wrap' style={{ gap: `${itemsSpacing ?? 16}px` }}>
                    {children}
                </div>
            </div>
        </section>
    );
});

export default FeaturedCollection;

export const schema = createSchema({
    type: 'featured-collection',
    title: 'Featured collection',
    childTypes: ['subheading', 'heading', 'paragraph', 'collection-items'],
    enabled: ({ page }) => ['INDEX', 'CUSTOM'].includes(page.type),
    settings: [
        {
            group: 'Collections',
            inputs: [{ type: 'collection-list', name: 'collections', label: 'Select collections' }],
        },
        {
            group: 'Layout',
            inputs: [contentWidthInput(), itemsSpacingInput(24), verticalPaddingInput()],
        },
    ],
    presets: {
        contentWidth: 'fixed',
        itemsSpacing: 24,
        verticalPadding: 'medium',
        children: [
            { type: 'subheading', content: 'THE STARTING XI' },
            { type: 'heading', content: 'GEAR UP FOR GAME DAY.', as: 'h2', weight: 'extrabold' },
            { type: 'paragraph', content: 'From match-day jerseys to boots made for the pitch, find your next essentials.', size: 'large', width: 'medium' },
            { type: 'collection-items', gridColumns: '4', itemsGap: 24 },
        ],
    },
});