import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';
import { type Alignment, alignmentInput, colorInput } from './shared';

type Weight = 'medium' | 'semibold' | 'bold';

const WEIGHT_CLASS: Record<Weight, string> = {
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
};
const ALIGN_CLASS: Record<Alignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

interface SubheadingProps extends HydrogenComponentProps {
    content: string;
    color?: string;
    weight: Weight;
    alignment: Alignment;
}

const Subheading = forwardRef<HTMLParagraphElement, SubheadingProps>((props, ref) => {
    const { content, color, weight, alignment, children, ...rest } = props;
    return (
        <p
            ref={ref}
            {...rest}
            className={cn(
                'w-full text-sm uppercase tracking-[0.2em]',
                WEIGHT_CLASS[weight] ?? WEIGHT_CLASS.semibold,
                ALIGN_CLASS[alignment] ?? '',
            )}
            style={color ? { color } : undefined}
        >
            {content}
        </p>
    );
});

export default Subheading;

export const schema = createSchema({
    type: 'subheading',
    title: 'Subheading',
    label: (data: SubheadingProps) => data.content,
    settings: [
        {
            group: 'Content',
            inputs: [
                { type: 'text', name: 'content', label: 'Content', defaultValue: 'Subheading' },
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
                            { value: 'medium', label: 'Medium' },
                            { value: 'semibold', label: 'Semibold' },
                            { value: 'bold', label: 'Bold' },
                        ],
                    },
                    defaultValue: 'semibold',
                },
                alignmentInput(),
            ],
        },
    ],
});