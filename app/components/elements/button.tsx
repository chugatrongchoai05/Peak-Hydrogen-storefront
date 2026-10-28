import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { type ButtonVariant, buttonClasses, isExternalLink } from '~/components/ui/button';
import { Link } from '~/components/ui/link';

interface ButtonElementProps extends HydrogenComponentProps {
    content: string;
    to: string;
    variant: ButtonVariant;
}

const ButtonElement = forwardRef<HTMLAnchorElement, ButtonElementProps>((props, ref) => {
    const { content, to, variant, children, ...rest } = props;
    const href = to || '/';
    const className = buttonClasses(variant ?? 'primary');

    if (isExternalLink(href)) {
        return (
            <a ref={ref} {...rest} href={href} className={className} rel='noreferrer'>
                {content}
            </a>
        );
    }
    return (
        <Link ref={ref} {...rest} to={href} className={className}>
            {content}
        </Link>
    );
});

export default ButtonElement;

export const schema = createSchema({
    type: 'button',
    title: 'Button',
    label: (data: ButtonElementProps) => data.content,
    settings: [
        {
            group: 'Content',
            inputs: [
                { type: 'text', name: 'content', label: 'Text content', defaultValue: 'Shop now' },
                { type: 'url', name: 'to', label: 'Link to', defaultValue: '/' },
            ],
        },
        {
            group: 'Style',
            inputs: [
                {
                    type: 'select',
                    name: 'variant',
                    label: 'Variant',
                    defaultValue: 'primary',
                    configs: {
                        options: [
                            { value: 'primary', label: 'Primary' },
                            { value: 'secondary', label: 'Secondary' },
                            { value: 'outline', label: 'Outline' },
                            { value: 'underline', label: 'Underline' },
                        ],
                    },
                },
            ],
        },
    ],
});