import type { Route } from '../+types/root';

export const FAVICON_LINKS: ReturnType<Route.LinksFunction> = [
    /* Light Mode */
    {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-16.ico',
        sizes: '16x16',
    },
    {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-32.ico',
        sizes: '32x32',
    },
    { rel: 'icon', type: 'image/png', href: '/favicon-32.png', sizes: '32x32' },
    {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-48.ico',
        sizes: '48x48',
    },
    {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-192.png',
        sizes: '192x192',
    },
    {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-256.ico',
        sizes: '256x256',
    },
    {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-512.png',
        sizes: '512x512',
    },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },

    /* 🌙 Dark mode versions */
    {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-16.dark.ico',
        sizes: '16x16',
        media: '(prefers-color-scheme: dark)',
    },
    {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-32.dark.ico',
        sizes: '32x32',
        media: '(prefers-color-scheme: dark)',
    },
    {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-32.dark.png',
        sizes: '32x32',
        media: '(prefers-color-scheme: dark)',
    },
    {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-48.dark.ico',
        sizes: '48x48',
        media: '(prefers-color-scheme: dark)',
    },
    {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-192.dark.png',
        sizes: '192x192',
        media: '(prefers-color-scheme: dark)',
    },
    {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-256.dark.ico',
        sizes: '256x256',
        media: '(prefers-color-scheme: dark)',
    },
    {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-512.dark.png',
        sizes: '512x512',
        media: '(prefers-color-scheme: dark)',
    },
    {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.dark.svg',
        media: '(prefers-color-scheme: dark)',
    },

    /* 🍎 Apple Touch Icon */
    { rel: 'apple-touch-icon', href: '/favicon-180.png', sizes: '180x180' },
    // { rel: "apple-touch-icon", href: "/favicon-180.dark.png", sizes: "180x180", media: "(prefers-color-scheme: dark)" },
];
