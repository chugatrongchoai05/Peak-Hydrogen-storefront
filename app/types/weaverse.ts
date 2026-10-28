// app/types/weaverse.ts
export type ThemeSettings = {
    colorPrimary: string;
    colorBackground: string;
    colorForeground: string;
    colorSurface: string;
    colorAccent: string;
    colorMuted: string;
    headingFont: 'barlow-condensed' | 'inter' | 'system';
    bodyFont: 'inter' | 'system';
    headingUppercase: boolean;
    topbarText: string;
    stickyHeader: boolean;
    copyright: string;
};