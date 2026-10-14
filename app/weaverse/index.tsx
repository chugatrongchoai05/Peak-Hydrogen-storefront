// hiển thị Weaverse content bằng cách sử dụng WeaverseHydrogenRoot với các components đã đăng ký
// export helper function validateWeaverseData, các routes sẽ gọi hàm này để trả về 404 khi một page không có Weaverse content đã được published

import { WeaverseHydrogenRoot, type WeaverseLoaderData } from "@weaverse/hydrogen";
import { components } from "./components";

function WeaverseError() {
  return <p className="p-8">Something went wrong rendering this page.</p>;
}

export function WeaverseContent() {
  return <WeaverseHydrogenRoot components={components} errorComponent={WeaverseError} />;
}

export function validateWeaverseData(weaverseData: WeaverseLoaderData) {
  if (
    !weaverseData?.page?.id ||
    (weaverseData?.page?.id?.includes("fallback") &&
      !weaverseData?.configs?.requestInfo?.queries?.isDesignMode)
  ) {
    throw new Response(null, { status: 404 });
  }
}