// đăng ký tất cả các React components muốn sử dụng trong Weaverse editor
import type { HydrogenComponent } from '@weaverse/hydrogen';
import * as Hero from '~/sections/hero';
import * as CollectionList from '~/sections/collection-list';
import * as CollectionBanner from '~/sections/collection-banner';
import * as ProductGridSection from '~/sections/product-grid';
import * as PageBanner from '~/sections/page-banner';
import * as ProductMain from '~/sections/product-main';
import * as RelatedProducts from '~/sections/related-products';
import * as Subheading from '~/components/elements/subheading';
import * as Heading from '~/components/elements/heading';
import * as Paragraph from '~/components/elements/paragraph';
import * as ButtonElement from '~/components/elements/button';
import * as FeaturedCollection from '~/sections/featured-collection';
import * as CollectionItems from '~/sections/featured-collection/items';

export const components: HydrogenComponent[] = [
    Hero,
    CollectionList,
    CollectionBanner,
    ProductGridSection,
    PageBanner,
    ProductMain,
    RelatedProducts,
    Subheading,
    Heading,
    Paragraph,
    ButtonElement,
    FeaturedCollection,
    CollectionItems,
];