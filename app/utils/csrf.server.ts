import { createCookie } from 'react-router';
import { CSRF, CSRFError } from 'remix-utils/csrf/server';
import { json } from './response.server';

const cookie = createCookie('csrf', {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',

    // TODO: Provide more secure secret
    secrets: ['secret'],
});

export const csrf = new CSRF({
    cookie,
    formDataKey: 'csrf',

    // TODO: Provide more secure secret
    secret: 'secret',
});

export async function validateCSRFToken(request: Request) {
    try {
        await csrf.validate(request);
    } catch (err) {
        if (err instanceof CSRFError)
            throw json({ message: 'CSRF Token Invalid' }, { status: 403 });
        throw json({ messgae: 'Bad Request' }, { status: 400 });
    }
}
