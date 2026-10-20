import type { ProductCollectionSortKeys, ProductFilter } from '@shopify/hydrogen/storefront-api-types';

export const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'best-selling', label: 'Best selling' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low-high', label: 'Price: low to high' },
    { value: 'price-high-low', label: 'Price: high to low' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

const COLLECTION_SORT: Record<SortValue, { sortKey: ProductCollectionSortKeys; reverse: boolean }> = {
    featured: { sortKey: 'COLLECTION_DEFAULT', reverse: false },
    'best-selling': { sortKey: 'BEST_SELLING', reverse: false },
    newest: { sortKey: 'CREATED', reverse: true },
    'price-low-high': { sortKey: 'PRICE', reverse: false },
    'price-high-low': { sortKey: 'PRICE', reverse: true },
};

export type ProductListParams = { sort: SortValue; available: boolean; priceMin?: number; priceMax?: number };

function readNumber(sp: URLSearchParams, key: string) {
    const raw = sp.get(key);
    if (raw === null || raw.trim() === '') return undefined;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseProductListParams(request: Request): ProductListParams {
    const sp = new URL(request.url).searchParams;
    const sortParam = sp.get('sort');
    const sort = SORT_OPTIONS.some((option) => option.value === sortParam)
        ? (sortParam as SortValue)
        : 'featured';
    return {
        sort,
        available: sp.get('available') === '1',
        priceMin: readNumber(sp, 'price_min'),
        priceMax: readNumber(sp, 'price_max'),
    };
}

// biến cho query collection(...).products(...)
export function toCollectionVariables(params: ProductListParams) {
    const filters: ProductFilter[] = [];
    if (params.available) filters.push({ available: true });
    if (params.priceMin !== undefined || params.priceMax !== undefined) {
        filters.push({ price: { min: params.priceMin, max: params.priceMax } });
    }
    return { ...COLLECTION_SORT[params.sort], filters };
}