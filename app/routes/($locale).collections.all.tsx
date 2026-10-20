import { redirect, type LoaderFunctionArgs } from 'react-router';
import { localizePath, resolveMarket } from '~/utils/locale';

export function loader({ request }: LoaderFunctionArgs) {
  const search = new URL(request.url);
  return redirect(localizePath(`/products${search}`, resolveMarket(request)), 301);
}