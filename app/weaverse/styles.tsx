// áp dụng các biến CSS toàn cục 
// dựa trên các theme settings được định nghĩa trong schema.server.ts 
// và được cấu hình trong Weaverse Studio
import { useThemeSettings } from "@weaverse/hydrogen";
import type { ThemeSettings } from "~/types/weaverse";

export function GlobalStyle() {
  const settings = useThemeSettings<ThemeSettings>();
  if (!settings) return null;
  return (
    <style
      id="global-theme-style"
      key="global-theme-style"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `:root {
          --color-primary: ${settings.colorPrimary};
          --color-background: ${settings.colorBackground};
          --color-foreground: ${settings.colorForeground};
        }`,
      }}
    />
  );
}