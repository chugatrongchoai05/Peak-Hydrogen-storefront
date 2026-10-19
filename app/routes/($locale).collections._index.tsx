import { getPaginationVariables, Image } from '@shopify/hydrogen';
import type { LoaderFunctionArgs } from 'react-router';
import { validateWeaverseData, WeaverseContent } from '~/weaverse';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { storefront, weaverse } = context;
  const paginationVariables = getPaginationVariables(request, { pageBy: 12 });
  const [{ collections }, weaverseData] = await Promise.all([
    storefront.query(COLLECTIONS_QUERY, { variables: paginationVariables }),
    weaverse.loadPage({ type: 'COLLECTION_LIST' }),
  ]);
  if (!weaverseData) throw new Response('Page data not found', { status: 404 });
  validateWeaverseData(weaverseData);
  return { collections, weaverseData };
}

export default function Collections() {
  return <WeaverseContent />;
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;