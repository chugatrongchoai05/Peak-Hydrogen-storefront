export type Alignment = 'left' | 'center' | 'right';

export function colorInput() {
    return { type: 'color' as const, name: 'color', label: 'Text color' };
}

export function alignmentInput() {
    return {
        type: 'toggle-group' as const,
        name: 'alignment',
        label: 'Alignment',
        configs: {
            options: [
                { value: 'left', label: 'Left', icon: 'align-start-vertical' },
                { value: 'center', label: 'Center', icon: 'align-center-vertical' },
                { value: 'right', label: 'Right', icon: 'align-end-vertical' },
            ],
        },
        defaultValue: 'center',
    };
}