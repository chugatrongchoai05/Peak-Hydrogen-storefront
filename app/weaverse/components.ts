// đăng ký tất cả các React components muốn sử dụng trong Weaverse editor
import type { HydrogenComponent } from '@weaverse/hydrogen';
import * as Hero from '~/sections/hero';
import * as CollectionList from '~/sections/collection-list';
import * as CollectionBanner from '~/sections/collection-banner';
import * as ProductGridSection from '~/sections/product-grid';
import * as PageBanner from '~/sections/page-banner';

export const components: HydrogenComponent[] = [
    Hero,
    CollectionList,
    CollectionBanner,
    ProductGridSection,
    PageBanner,
];