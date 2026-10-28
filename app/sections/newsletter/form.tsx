import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef, useId } from 'react';
import { useFetcher } from 'react-router';
import { buttonClasses } from '~/components/ui/button';

interface NewsletterFormProps extends HydrogenComponentProps {
    placeholder: string;
    buttonLabel: string;
    successMessage: string;
    errorMessage: string;
}

type ActionResult = { ok: boolean; error?: string };

const NewsletterForm = forwardRef<HTMLDivElement, NewsletterFormProps>((props, ref) => {
    const { placeholder, buttonLabel, successMessage, errorMessage, children, ...rest } = props;
    const fetcher = useFetcher<ActionResult>();
    const inputId = useId();
    const submitting = fetcher.state !== 'idle';
    const succeeded = fetcher.data?.ok === true;
    const failed = fetcher.data?.ok === false;

    return (
        <div ref={ref} {...rest} className='flex justify-center items-center w-full max-w-480px'>
            {succeeded ? (
                <p role='status' className='py-3 text-lg font-semibold'>
                    {successMessage}
                </p>
            ) : (
                <fetcher.Form method='post' action='/api/newsletter' className='flex flex-col gap-3 sm:flex-row'>
                    <label htmlFor={inputId} className='sr-only'>
                        {placeholder}
                    </label>
                    <input
                        id={inputId}
                        type='email'
                        name='email'
                        required
                        autoComplete='email'
                        inputMode='email'
                        placeholder={placeholder}
                        disabled={submitting}
                        className='min-w-0 flex-1 border border-current bg-transparent px-4 py-3 text-base placeholder:text-current placeholder:opacity-60 focus:outline-2 focus:outline-offset-2 focus:outline-accent'
                    />
                    {/* Honeypot: người thật không nhìn thấy và không điền */}
                    <input
                        type='text'
                        name='website'
                        tabIndex={-1}
                        autoComplete='off'
                        aria-hidden='true'
                        className='absolute -left-9999px h-0 w-0 opacity-0'
                    />
                    <button
                        type='submit'
                        disabled={submitting}
                        className={buttonClasses('secondary', 'disabled:cursor-wait disabled:opacity-60')}
                    >
                        {submitting ? 'Sending...' : buttonLabel}
                    </button>
                </fetcher.Form>
            )}
            {failed && (<p role='alert' className='mt-3 text-sm'>{errorMessage}</p>)}
        </div>
    );
});

export default NewsletterForm;

export const schema = createSchema({
    type: 'newsletter-form',
    title: 'Newsletter form',
    limit: 1,
    settings: [
        {
            group: 'Content',
            inputs: [
                { type: 'text', name: 'placeholder', label: 'Email placeholder', defaultValue: 'Enter your email address' },
                { type: 'text', name: 'buttonLabel', label: 'Button label', defaultValue: 'SIGN ME UP' },
                { type: 'text', name: 'successMessage', label: 'Success message', defaultValue: 'You are in! Check your inbox soon.' },
                { type: 'text', name: 'errorMessage', label: 'Error message', defaultValue: 'Something went wrong. Please try again.' },
            ],
        },
    ],
});