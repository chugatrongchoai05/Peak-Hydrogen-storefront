// định nghĩa metadata của theme (name, author, version), 
// global settings schema (dùng để điền vào Theme Customizer trong Weaverse Studio)
// và cấu hình i18n
import type { HydrogenThemeSchema } from "@weaverse/hydrogen";

export const themeSchema: HydrogenThemeSchema = {
  info: {
    version: "1.0.0",
    author: "VietHungTran",
    name: "Peak",
    authorProfilePhoto: "",
    documentationUrl: "https://docs.weaverse.io",
    supportUrl: "https://help.weaverse.io/",
  },
  settings: [
    {
      group: "Colors",
      inputs: [
        { type: "color", label: "Primary", name: "colorPrimary", defaultValue: "#111111" },
        { type: "color", label: "Background", name: "colorBackground", defaultValue: "#ffffff" },
        { type: "color", label: "Foreground", name: "colorForeground", defaultValue: "#111111" },
      ],
    },
    {
      group: "Header",
      inputs: [
        { type: "text", label: "Topbar text", name: "topbarText", defaultValue: "Free shipping on orders over $50" },
        { type: "switch", label: "Sticky header", name: "stickyHeader", defaultValue: true },
      ],
    },
    {
      group: "Footer",
      inputs: [
        { type: "text", label: "Copyright", name: "copyright", defaultValue: "© 2026 Peak"},
      ],
    },
  ],
};