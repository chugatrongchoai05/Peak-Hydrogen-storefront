// áp dụng các biến CSS toàn cục 
// dựa trên các theme settings được định nghĩa trong schema.server.ts 
// và được cấu hình trong Weaverse Studio
import { useThemeSettings } from '@weaverse/hydrogen';
import type { ThemeSettings } from '~/types/weaverse';

const FONT_STACKS: Record<string, string> = {
  'barlow-condensed': '"Barlow Condensed", ui-sans-serif, system-ui, sans-serif',
  inter: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
  system: 'ui-sans-serif, system-ui, sans-serif',
};
const HEX = /^#[0-9a-f]{3,8}$/i;
const color = (value: string | undefined, fallback: string) => value && HEX.test(value) ? value : fallback;

export function GlobalStyle() {
  const settings = useThemeSettings<ThemeSettings>();
  if (!settings) return null;

  const css = `:root {
  --color-primary: ${color(settings.colorPrimary, '#111111')};
  --color-background: ${color(settings.colorBackground, '#ffffff')};
  --color-foreground: ${color(settings.colorForeground, '#111111')};
  --color-surface: ${color(settings.colorSurface, '#f2f2f0')};
  --color-accent: ${color(settings.colorAccent, '#c7f36b')};
  --color-muted: ${color(settings.colorMuted, '#6b6b6b')};
  --font-heading: ${FONT_STACKS[settings.headingFont] ?? FONT_STACKS['barlow-condensed']};
  --font-body: ${FONT_STACKS[settings.bodyFont] ?? FONT_STACKS.inter};
  --heading-transform: ${settings.headingUppercase === false ? 'none' : 'uppercase'};
}`;

  return (
    <style
      id='global-theme-style'
      key='global-theme-style'
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}