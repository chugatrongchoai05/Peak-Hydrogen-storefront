import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';
import { type Alignment, alignmentInput, colorInput } from './shared';

type Size = 'small' | 'base' | 'large';
type Width = 'narrow' | 'medium' | 'wide' | 'full';
type ParagraphTag = 'p' | 'div';

const SIZE_CLASS: Record<Size, string> = {
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg md:text-xl',
};
const WIDTH_CLASS: Record<Width, string> = {
    narrow: 'max-w-md',
    medium: 'max-w-xl',
    wide: 'max-w-3xl',
    full: 'max-w-none',
};

const ALIGN_CLASS: Record<Alignment, string> = {
    left: 'text-left mr-auto',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
};

interface ParagraphProps extends HydrogenComponentProps {
    content: string;
    as: ParagraphTag;
    color?: string;
    size: Size;
    width: Width;
    alignment: Alignment;
}

const Paragraph = forwardRef<HTMLElement, ParagraphProps>((props, ref) => {
    const { content, as, color, size, width, alignment, children, ...rest } = props;
    const Tag = as ?? 'p';
    return (
        <Tag
            ref={ref as never}
            {...rest}
            className={cn(
                'paragraph w-full whitespace-pre-line',
                SIZE_CLASS[size] ?? SIZE_CLASS.base,
                WIDTH_CLASS[width] ?? WIDTH_CLASS.medium,
                ALIGN_CLASS[alignment] ?? '',
            )}
            style={color ? { color } : undefined}
        >
            {content}
        </Tag>
    );
});

export default Paragraph;

export const schema = createSchema({
    type: 'paragraph',
    title: 'Paragraph',
    label: (data: ParagraphProps) => data.content,
    settings: [
        {
            group: 'Content',
            inputs: [
                {
                    type: 'textarea',
                    name: 'content',
                    label: 'Content',
                    defaultValue: 'Use this text to share information about your brand.',
                },
                {
                    type: 'select',
                    name: 'as',
                    label: 'HTML tag',
                    defaultValue: 'p',
                    configs: {
                        options: [
                            { value: 'p', label: '<p>' },
                            { value: 'div', label: '<div>' },
                        ],
                    },
                },
            ],
        },
        {
            group: 'Style',
            inputs: [
                colorInput(),
                {
                    type: 'select',
                    name: 'size',
                    label: 'Text size',
                    defaultValue: 'base',
                    configs: {
                        options: [
                            { value: 'small', label: 'Small' },
                            { value: 'base', label: 'Base' },
                            { value: 'large', label: 'Large' },
                        ],
                    },
                },
                {
                    type: 'select',
                    name: 'width',
                    label: 'Width',
                    defaultValue: 'medium',
                    configs: {
                        options: [
                            { value: 'narrow', label: 'Narrow' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'wide', label: 'Wide' },
                            { value: 'full', label: 'Full' },
                        ],
                    },
                },
                alignmentInput(),
            ],
        },
    ],
});