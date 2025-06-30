import { createThemeSessionResolver } from "remix-themes";
import { createCookieSessionStorage } from "react-router";

export const themeSessionResolver = createThemeSessionResolver(
    createCookieSessionStorage({
        cookie: {
            name: '__remix-themes',
            domain: process.env.NODE_ENV === 'production' ? 'alexius-huang.dev' : undefined,
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secrets: ['s3cr3t'],
            secure: process.env.NODE_ENV === 'production',
        },
    }),
);
