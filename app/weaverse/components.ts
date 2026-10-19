// đăng ký tất cả các React components muốn sử dụng trong Weaverse editor
import type { HydrogenComponent } from '@weaverse/hydrogen';
import * as Hero from '~/sections/hero';
import * as CollectionList from '~/sections/collection-list';

export const components: HydrogenComponent[] = [
    Hero,
    CollectionList,
];