import { getPaginationVariables } from '@shopify/hydrogen';
import type { LoaderFunctionArgs } from 'react-router';
import { parseProductListParams, toProductsVariables } from '~/utils/product-list';
import { validateWeaverseData, WeaverseContent } from '~/weaverse';

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { storefront, weaverse } = context;
    const paginationVariables = getPaginationVariables(request, { pageBy: 12 });
    const listParams = parseProductListParams(request, 'all');

    const [{ products }, weaverseData] = await Promise.all([
        storefront.query(CATALOG_QUERY, {
            variables: { ...paginationVariables, ...toProductsVariables(listParams) },
        }),
        weaverse.loadPage({ type: 'ALL_PRODUCTS' }),
    ]);

    if (!weaverseData) throw new Response('Page data not found', { status: 404 });
    validateWeaverseData(weaverseData);
    return { products, listParams, weaverseData };
}

export default function AllProducts() {
    return <WeaverseContent />;
}

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: $sortKey,
      reverse: $reverse,
      query: $query
    ) {
      nodes { ...CatalogItem }
      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    }
  }
  fragment CatalogItem on Product {
    id
    handle
    title
    featuredImage { id altText url width height }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
  }
` as const;