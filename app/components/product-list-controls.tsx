import { Form, useLocation } from 'react-router';
import { Link } from '~/components/ui/link';
import { SORT_OPTIONS, type ProductListParams } from '~/utils/product-list';

const field = 'rounded border border-muted/40 px-3 py-2';

export function ProductListControls({ params, showSort, showFilters }: {
    params: ProductListParams;
    showSort: boolean;
    showFilters: boolean;
}) {
    const { pathname } = useLocation();
    const submitOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        e.currentTarget.form?.requestSubmit();
    const isDirty = params.sort !== 'featured' || params.available || params.priceMin !== undefined || params.priceMax !== undefined;

    return (
        <Form
            key={JSON.stringify(params)} // remount để input theo URL khi bấm Back
            method='get'
            className='mb-8 flex flex-wrap items-end gap-4 border-y border-muted/30 py-4 text-sm'
        >
            {showSort && (
                <label className='flex flex-col gap-1'>
                    Sort by
                    <select name='sort' defaultValue={params.sort} onChange={submitOnChange} className={field}>
                        {SORT_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                    </select>
                </label>
            )}
            {showFilters && (
                <>
                    <label className='flex items-center gap-2'>
                        <input type='checkbox' name='available' value='1' defaultChecked={params.available} onChange={submitOnChange} />
                        In stock only
                    </label>
                    <label className='flex flex-col gap-1'>
                        Min price
                        <input type='number' name='price_min' min='0' defaultValue={params.priceMin} className={`${field} w-24`} />
                    </label>
                    <label className='flex flex-col gap-1'>
                        Max price
                        <input type='number' name='price_max' min='0' defaultValue={params.priceMax} className={`${field} w-24`} />
                    </label>
                    <button type='submit' className={field}>Apply</button>
                </>
            )}
            {isDirty && <Link to={pathname} className='underline'>Clear</Link>}
        </Form>
    );
}