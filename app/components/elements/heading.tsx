import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';
import { type Alignment, alignmentInput, colorInput } from './shared';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4';
type Weight = 'semibold' | 'bold' | 'extrabold';

const SIZE_CLASS: Record<HeadingTag, string> = {
    h1: 'text-5xl leading-[0.95] md:text-7xl',
    h2: 'text-4xl leading-none md:text-5xl',
    h3: 'text-2xl leading-tight md:text-3xl',
    h4: 'text-xl leading-tight md:text-2xl',
};
const WEIGHT_CLASS: Record<Weight, string> = {
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
};
const ALIGN_CLASS: Record<Alignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

interface HeadingProps extends HydrogenComponentProps {
    content: string;
    as: HeadingTag;
    color?: string;
    weight: Weight;
    alignment: Alignment;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
    const { content, as, color, weight, alignment, children, ...rest } = props;
    const Tag = as ?? 'h2';

    return (
        <Tag
            ref={ref}
            {...rest}
            className={cn(
                'w-full font-heading tracking-tight',
                SIZE_CLASS[Tag],
                WEIGHT_CLASS[weight] ?? WEIGHT_CLASS.bold,
                ALIGN_CLASS[alignment] ?? '',
            )}
            style={color ? { color } : undefined}
        >
            {content}
        </Tag>
    );
});

export default Heading;

export const schema = createSchema({
    type: 'heading',
    title: 'Heading',
    label: (data: HeadingProps) => data.content,
    settings: [
        {
            group: 'Content',
            inputs: [
                { type: 'text', name: 'content', label: 'Content', defaultValue: 'Heading' },
                {
                    type: 'select',
                    name: 'as',
                    label: 'HTML tag',
                    configs: {
                        options: [
                            { value: 'h1', label: '<h1> (heading 1)' },
                            { value: 'h2', label: '<h2> (heading 2)' },
                            { value: 'h3', label: '<h3> (heading 3)' },
                            { value: 'h4', label: '<h4> (heading 4)' },
                        ],
                    },
                    defaultValue: 'h1',
                },
            ],
        },
        {
            group: 'Style',
            inputs: [
                colorInput(),
                {
                    type: 'select',
                    name: 'weight',
                    label: 'Weight',
                    configs: {
                        options: [
                            { value: 'semibold', label: 'Semibold' },
                            { value: 'bold', label: 'Bold' },
                            { value: 'extrabold', label: 'Extrabold' },
                        ],
                    },
                    defaultValue: 'bold',
                },
                alignmentInput(),
            ],
        },
    ],
});