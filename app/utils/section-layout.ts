export type ContentWidth = 'full' | 'stretch' | 'fixed';
export type VerticalPadding = 'none' | 'small' | 'medium' | 'large';

export const CONTENT_WIDTH_CLASS: Record<ContentWidth, string> = {
    full: 'w-full px-4',
    stretch: 'w-full px-4 md:px-10 lg:px-16',
    fixed: 'mx-auto w-full max-w-7xl px-4 md:px-8',
};

export const VERTICAL_PADDING_CLASS: Record<VerticalPadding, string> = {
    none: 'py-0',
    small: 'py-8 md:py-12',
    medium: 'py-12 md:py-20',
    large: 'py-20 md:py-28',
};

export function contentWidthInput(defaultValue: ContentWidth = 'fixed') {
    return {
        type: 'select' as const,
        name: 'contentWidth',
        label: 'Content width',
        defaultValue,
        configs: {
            options: [
                { value: 'full', label: 'Full page' },
                { value: 'stretch', label: 'Stretch' },
                { value: 'fixed', label: 'Fixed' },
            ],
        },
    };
}

export function itemsSpacingInput(defaultValue = 16) {
    return {
        type: 'range' as const,
        name: 'itemsSpacing',
        label: 'Items spacing',
        defaultValue,
        configs: { min: 0, max: 60, step: 2, unit: 'px' },
    };
}

export function verticalPaddingInput(defaultValue: VerticalPadding = 'medium') {
    return {
        type: 'select' as const,
        name: 'verticalPadding',
        label: 'Vertical padding',
        defaultValue,
        configs: {
            options: [
                { value: 'none', label: 'None' },
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
            ],
        },
    };
}