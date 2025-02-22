import { Honeypot, SpamError } from 'remix-utils/honeypot/server';
import { json } from './response';

export const honeypot = new Honeypot({
    validFromFieldName: process.env.TESTING ? null : 'validForm',
    encryptionSeed: process.env.HONEYPOT_SECRET
});

export async function checkHoneypot(formData: FormData) {
    try {
        await honeypot.check(formData);
    } catch (error) {
        if (error instanceof SpamError)
            throw json({ message: 'Access denied' }, { status: 403 });
        throw json ({ message: 'Bad Request' }, { status: 400 });
    }
}
