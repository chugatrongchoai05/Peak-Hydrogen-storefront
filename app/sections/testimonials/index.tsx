import { type ComponentLoaderArgs, createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';
import { mapYotpoResponse, siteReviewsUrl, type YotpoReview, type YotpoSummary } from '~/lib/yotpo';

type TestimonialsData = {
    limit: number;
    minScore: number;
    showSummary: boolean;
};

type LoaderData = { reviews: YotpoReview[]; summary: YotpoSummary | null };

export const loader = async ({ weaverse, data }: ComponentLoaderArgs<TestimonialsData, Env>): Promise<LoaderData> => {
    const empty: LoaderData = { reviews: [], summary: null };
    const appKey = weaverse.env?.YOTPO_APP_KEY;
    if (!appKey) return empty;

    const limit = Math.min(Math.max(Number(data?.limit) || 3, 1), 6);
    const minScore = Math.min(Math.max(Number(data?.minScore) || 4, 1), 5);

    try {
        const json = await weaverse.fetchWithCache(siteReviewsUrl(appKey), { strategy: weaverse.storefront.CacheLong() });
        return mapYotpoResponse(json, { limit, minScore });
    } catch (error) {
        console.error('Yotpo testimonials failed to load');
        return empty;
    }
};

function Stars({ score }: { score: number }) {
    return (
        <span role='img' aria-label={`${score} out of 5 stars`} className='tracking-wider'>
            {'★'.repeat(score)}
            <span className='text-muted'>{'★'.repeat(5 - score)}</span>
        </span>
    );
}

type TestimonialsProps = HydrogenComponentProps<LoaderData> & TestimonialsData;

const Testimonials = forwardRef<HTMLElement, TestimonialsProps>((props, ref) => {
    const { loaderData, showSummary, children, className, ...rest } = props;
    const reviews = loaderData?.reviews ?? [];
    const summary = loaderData?.summary;
    if (reviews.length === 0) {
        return (
            <section ref={ref} {...rest} className={cn('px-4 py-12', className)}>
                {children}
                <p className='text-sm text-muted'>No Yotpo reviews to display yet.</p>
            </section>
        );
    }

    return (
        <section ref={ref} {...rest} className={cn('bg-surface px-4 py-16 text-foreground', className)}>
            <div className='mx-auto flex max-w-7xl flex-col gap-10'>
                <div className='flex flex-wrap gap-3'>{children}</div>

                {showSummary && summary && (
                    <p className='text-sm font-semibold'>
                        <Stars score={Math.round(summary.averageScore)} />{' '}
                        {summary.averageScore} / 5 · {summary.totalReviews} reviews
                    </p>
                )}

                <ul className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {reviews.map((review) => (
                        <li key={review.id} className='flex flex-col gap-3 bg-background p-6'>
                            <Stars score={review.score} />
                            {review.title && <h3 className='font-heading text-lg uppercase'>{review.title}</h3>}
                            <p className='line-clamp-5 text-sm'>{review.content}</p>
                            <p className='mt-auto text-xs text-muted'>
                                {review.author}
                                {review.verifiedBuyer ? ' · Verified buyer' : ''}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
});

export default Testimonials;

export const schema = createSchema({
    type: 'testimonials',
    title: 'Testimonials',
    settings: [
        {
            group: 'Yotpo reviews',
            inputs: [
                {
                    type: 'range', name: 'limit', label: 'Number of reviews', defaultValue: 3,
                    configs: { min: 1, max: 6, step: 1 }
                },
                {
                    type: 'range', name: 'minScore', label: 'Minimum rating', defaultValue: 4,
                    configs: { min: 1, max: 5, step: 1 }
                },
                { type: 'switch', name: 'showSummary', label: 'Show average rating', defaultValue: true },
            ],
        },
    ],
    childTypes: ['subheading', 'heading', 'paragraph'],
    presets: {
        children: [
            { type: 'subheading', content: 'WHAT PLAYERS SAY' },
            { type: 'heading', content: 'TRUSTED ON AND OFF THE PITCH.' },
        ],
    },
});