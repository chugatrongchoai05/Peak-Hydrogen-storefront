import type { ProductCollectionSortKeys, ProductFilter, ProductSortKeys } from '@shopify/hydrogen/storefront-api-types';

export const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'best-selling', label: 'Best selling' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low-high', label: 'Price: low to high' },
    { value: 'price-high-low', label: 'Price: high to low' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];
export type ListKind = 'collection' | 'all';

export function getSortOptions (kind: ListKind) {
    return kind === 'all' ? SORT_OPTIONS.filter((option) => option.value !== 'featured') : SORT_OPTIONS;
}

export function getDefaultSort (kind: ListKind): SortValue {
    return kind === 'all' ? 'newest' : 'featured';
}

const COLLECTION_SORT: Record<SortValue, { sortKey: ProductCollectionSortKeys; reverse: boolean }> = {
    featured: { sortKey: 'COLLECTION_DEFAULT', reverse: false },
    'best-selling': { sortKey: 'BEST_SELLING', reverse: false },
    newest: { sortKey: 'CREATED', reverse: true },
    'price-low-high': { sortKey: 'PRICE', reverse: false },
    'price-high-low': { sortKey: 'PRICE', reverse: true },
};

export type ProductListParams = {
    kind: ListKind;
    sort: SortValue;
    available: boolean;
    priceMin?: number;
    priceMax?: number;
};

function readNumber(sp: URLSearchParams, key: string) {
    const raw = sp.get(key);
    if (raw === null || raw.trim() === '') return undefined;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseProductListParams(request: Request, kind: ListKind = 'collection'): ProductListParams {
    const sp = new URL(request.url).searchParams;
    const sortParam = sp.get('sort');
    const sort = getSortOptions(kind).some((option) => option.value === sortParam) ? (sortParam as SortValue) : getDefaultSort(kind);
    return {
        kind,
        sort,
        available: sp.get('available') === '1',
        priceMin: readNumber(sp, 'price_min'),
        priceMax: readNumber(sp, 'price_max'),
    };
}

export const PRODUCTS_SORT: Record<
    Exclude<SortValue, 'featured'>,
    { sortKey: ProductSortKeys; reverse: boolean }
> = {
    'best-selling': { sortKey: 'BEST_SELLING', reverse: false },
    newest: { sortKey: 'CREATED_AT', reverse: true },
    'price-low-high': { sortKey: 'PRICE', reverse: false },
    'price-high-low': { sortKey: 'PRICE', reverse: true },
};

export function toCollectionVariables(params: ProductListParams) {
    const filters: ProductFilter[] = [];
    if (params.available) filters.push({ available: true });
    if (params.priceMin !== undefined || params.priceMax !== undefined) {
        filters.push({ price: { min: params.priceMin, max: params.priceMax } });
    }
    return { ...COLLECTION_SORT[params.sort], filters };
}

export function toProductsVariables(params: ProductListParams) {
    const terms: string[] = [];
    if (params.available) terms.push('available_for_sale: true');
    if (params.priceMin !== undefined) terms.push(`variants.price:>=${params.priceMin}`)
    if (params.priceMax !== undefined) terms.push(`variants.price:<=${params.priceMax}`)
    const sort = params.sort === 'featured' ? PRODUCTS_SORT.newest : PRODUCTS_SORT[params.sort];
    return { ...sort, query: terms.length > 0 ? terms.join(' ') : undefined };
}