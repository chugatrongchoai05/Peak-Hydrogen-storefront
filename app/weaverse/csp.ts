// tạo các directives CSP (Content Security Policy) để iframe của Studio nhúng được storefront
import type { HydrogenRouterContextProvider } from "@shopify/hydrogen";

export function getWeaverseCsp(request: Request, context: HydrogenRouterContextProvider) {
  const url = new URL(request.url);
  const weaverseHost = url.searchParams.get("weaverseHost") || context.env.WEAVERSE_HOST;
  const isDesignMode = url.searchParams.get("weaverseHost");
  const weaverseHosts = ["*.weaverse.io", "*.shopify.com", "*.myshopify.com"];
  if (weaverseHost) weaverseHosts.push(weaverseHost);

  const updatedCsp: { [x: string]: string[] | string | boolean } = {
    defaultSrc: [
      "data:",
      "*.youtube.com",
      "*.youtu.be",
      "*.vimeo.com",
      "*.google.com",
      "*.google-analytics.com",
      "*.googletagmanager.com",
      "cdn.jsdelivr.net",
      ...weaverseHosts,
    ],
    connectSrc: ["vimeo.com", "*.shopifysvc.com", "*.google-analytics.com", ...weaverseHosts],
    styleSrc: weaverseHosts,
    scriptSrc: ["https://cdn.shopify.com"],
  };

  if (isDesignMode) updatedCsp.frameAncestors = ["*"];
  return updatedCsp;
}