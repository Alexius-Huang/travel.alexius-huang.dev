import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import { csrf } from './utils/csrf.server';
import { json } from './utils/response.server';
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react';
import { honeypot } from './utils/honeypot.server';
import { HoneypotProvider } from 'remix-utils/honeypot/react';
import type { HoneypotInputProps } from 'remix-utils/honeypot/server';
import { ThemeSwitch } from '~/components/theme-switch';
import { Footer } from '~/containers/footer';
import { SunOutlineIcon } from './icons/outline/sun';
import { MoonOutlineIcon } from './icons/outline/moon';
import { themeSessionResolver } from './utils/theme.server';
import {
    PreventFlashOnWrongTheme,
    ThemeProvider,
    useTheme,
    type Theme,
} from 'remix-themes';

import './app.css';
import { trim } from './utils/trim';

export const links: Route.LinksFunction = () => [];

type LoaderData = {
    token: string;
    honeypotInputProps: HoneypotInputProps;
    theme: Theme;
};
export async function loader({ request }: Route.LoaderArgs) {
    const [token, cookieHeader] = await csrf.commitToken();
    const honeypotInputProps = await honeypot.getInputProps();
    const { getTheme } = await themeSessionResolver(request);
    return json(
        {
            token,
            honeypotInputProps,
            theme: getTheme(),
        } as LoaderData,
        { headers: { 'Set-Cookie': cookieHeader as string } },
    );
}

export function App() {
    const data = useLoaderData();
    const [theme] = useTheme();

    return (
        <html
            lang="en"
            data-theme={theme ?? ''}
            className={trim`
                scrollbar-thumb-rounded
                scrollbar-thumb-yellow-300
                scrollbar-track-yellow-300/30
                dark:scrollbar-thumb-blue-500/70
                dark:scrollbar-track-blue-500/30
            `}
        >
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
                <Links />
            </head>
            <body>
                <ThemeSwitch
                    size="xs"
                    variant="tertiary"
                    startIcon={SunOutlineIcon}
                    endIcon={MoonOutlineIcon}
                    className="fixed right-4.5 bottom-6 z-[100]"
                />

                <div className="h-screen overflow-y-scroll scrollbar scrollbar-w-1.5">
                    <Outlet />
                    <Footer className="mt-[120px] text-center mb-[5rem] py-[2rem]" />
                </div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function AppWithProviders() {
    const { token, honeypotInputProps, theme } = useLoaderData<LoaderData>();

    return (
        <HoneypotProvider {...honeypotInputProps}>
            <AuthenticityTokenProvider token={token}>
                <ThemeProvider
                    specifiedTheme={theme}
                    themeAction="/action/set-theme"
                >
                    <App />
                </ThemeProvider>
            </AuthenticityTokenProvider>
        </HoneypotProvider>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = 'Oops!';
    let details = 'An unexpected error occurred.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details =
            error.status === 404
                ? 'The requested page could not be found.'
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
