// định nghĩa metadata của theme (name, author, version), 
// global settings schema (dùng để điền vào Theme Customizer trong Weaverse Studio)
// và cấu hình i18n
import type { HydrogenThemeSchema } from '@weaverse/hydrogen';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '~/utils/locale';

export const themeSchema: HydrogenThemeSchema = {
  info: {
    version: '1.0.0',
    author: 'VietHungTran',
    name: 'Peak',
    authorProfilePhoto: '',
    documentationUrl: 'https://docs.weaverse.io',
    supportUrl: 'https://help.weaverse.io/',
  },
  settings: [
    {
      group: 'Colors',
      inputs: [
        { type: 'color', label: 'Primary', name: "colorPrimary", defaultValue: '#111111' },
        { type: 'color', label: 'Background', name: "colorBackground", defaultValue: '#FFFFFF' },
        { type: 'color', label: 'Foreground', name: "colorForeground", defaultValue: '#111111' },
        { type: 'color', label: 'Surface', name: "colorSurface", defaultValue: '#F2F2F0' },
        { type: 'color', label: 'Accent', name: "colorAccent", defaultValue: '#C7F36B' },
        { type: 'color', label: 'Muted text', name: "colorMuted", defaultValue: '#6B6B6B' },
      ],
    },
    {
      group: 'Typography',
      inputs: [
        {
          type: 'select',
          label: 'Heading font',
          name: 'headingFont',
          defaultValue: 'barlow-condensed',
          configs: {
            options: [
              { value: 'barlow-condensed', label: 'Barlow Condensed' },
              { value: 'inter', label: 'Inter' },
              { value: 'system', label: 'System UI' },
            ],
          },
        },
        {
          type: 'select',
          label: 'Body font',
          name: 'bodyFont',
          defaultValue: 'inter',
          configs: {
            options: [
              { value: 'inter', label: 'Inter' },
              { value: 'system', label: 'System UI' },
            ],
          },
        },
        { type: 'switch', label: 'Uppercase headings', name: 'headingUppercase', defaultValue: true },
      ],
    },
    {
      group: 'Header',
      inputs: [
        { type: 'text', label: 'Topbar text', name: 'topbarText', defaultValue: 'Free shipping on orders over $50' },
        { type: 'switch', label: 'Sticky header', name: 'stickyHeader', defaultValue: true },
      ],
    },
    {
      group: 'Footer',
      inputs: [
        { type: 'text', label: 'Copyright', name: 'copyright', defaultValue: '© 2026 Peak' },
      ],
    },
  ],
  i18n: {
    urlStructure: 'url-path',
    defaultLocale: DEFAULT_LOCALE,
    shopLocales: SUPPORTED_LOCALES,
    translation: true,
  },
};