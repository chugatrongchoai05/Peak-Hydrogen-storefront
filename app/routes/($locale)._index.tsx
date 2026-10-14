import type { LoaderFunctionArgs } from "react-router";
import { validateWeaverseData, WeaverseContent } from "~/weaverse";

export async function loader({ context }: LoaderFunctionArgs) {
  const weaverseData = await context.weaverse.loadPage({ type: "INDEX" });
  validateWeaverseData(weaverseData);
  return { weaverseData };
}

export default function Homepage() {
  return <WeaverseContent />;
}