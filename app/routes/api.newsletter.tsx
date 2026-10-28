import { type ActionFunctionArgs, data } from 'react-router';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OMNISEND_CONTACTS_URL = 'https://api.omnisend.com/api/contacts';
const OMNISEND_VERSION = '2026-03-15';

type Result = { ok: true } | { ok: false; error: 'invalid_email' | 'server_error' };

export async function action({ request, context }: ActionFunctionArgs) {
    if (request.method !== 'POST') return data<Result>({ ok: false, error: 'server_error' }, { status: 405 });

    const formData = await request.formData();

    // Honeypot: trường ẩn mà người thật không điền. Bot điền thì giả vờ thành công
    if (String(formData.get('website') ?? '').length > 0) return data<Result>({ ok: true });

    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    if (email.length > 254 || !EMAIL_RE.test(email)) return data<Result>({ ok: false, error: 'invalid_email' }, { status: 400 });

    const apiKey = context.env.OMNISEND_API_KEY;
    if (!apiKey) {
        console.error('newsletter: OMNISEND_API_KEY is not set');
        return data<Result>({ ok: false, error: 'server_error' }, { status: 500 });
    }

    try {
        const response = await fetch(OMNISEND_CONTACTS_URL, {
            method: 'POST',
            headers: {
                Authorization: `Omnisend-API-Key ${apiKey}`,
                'Omnisend-Version': OMNISEND_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifiers: [
                    {
                        type: 'email',
                        id: email,
                        channels: { email: { status: 'subscribed' } },
                        consent: {
                            source: 'hydrogen-storefront-newsletter',
                            createdAt: new Date().toISOString(),
                            ip: request.headers.get('CF-Connecting-IP') ?? undefined,
                            userAgent: request.headers.get('User-Agent') ?? undefined,
                        },
                    },
                ],
            }),
        });

        // tạo mới 201, contact đã có và được cập nhật 200
        if (response.ok) return data<Result>({ ok: true });

        // không trả chi tiết lỗi của Omnisend về trình duyệt; chỉ ghi log phía server
        console.error('newsletter: Omnisend error', response.status, await response.text());
        const invalid = response.status === 400 || response.status === 422;
        return data<Result>(
            { ok: false, error: invalid ? 'invalid_email' : 'server_error' },
            { status: invalid ? 400 : 502 },
        );
    } catch (error) {
        console.error('newsletter: request failed', error);
        return data<Result>({ ok: false, error: 'server_error' }, { status: 502 });
    }
}