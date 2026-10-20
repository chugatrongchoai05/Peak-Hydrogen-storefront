import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import { getPaginationVariables } from '@shopify/hydrogen';
import type { LoaderFunctionArgs } from 'react-router';
import { parseProductListParams, toCollectionVariables } from '~/utils/product-list';
import { validateWeaverseData, WeaverseContent } from '~/weaverse';

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront, weaverse } = context;
  if (!handle) throw new Response('Missing collection handle', { status: 404 });

  const paginationVariables = getPaginationVariables(request, { pageBy: 12 });
  const listParams = parseProductListParams(request);

  const [{ collection }, weaverseData] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: { handle, ...paginationVariables, ...toCollectionVariables(listParams) },
    }),
    weaverse.loadPage({ type: 'COLLECTION', handle }),
  ]);

  if (!collection) throw new Response(`Collection ${handle} not found`, { status: 404 });
  if (!weaverseData) throw new Response('Page data not found', { status: 404 });
  validateWeaverseData(weaverseData);
  redirectIfHandleIsLocalized(request, { handle, data: collection });

  // tách products ra ngoài để section dùng chung cho cả All Products
  const { products, ...collectionInfo } = collection;
  return { collection: collectionInfo, products, listParams, weaverseData };
}

export default function Collection() {
  return <WeaverseContent />;
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
        sortKey: $sortKey,
        reverse: $reverse,
        filters: $filters
      ) {
        nodes { ...ProductItem }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;