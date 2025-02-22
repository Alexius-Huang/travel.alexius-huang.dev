import { json } from '~/utils/response.server';
import type { Route } from './+types/_index';
import { Link, useLoaderData } from 'react-router';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Travel | Alexius Huang' },
        { name: 'description', content: "Alexius's Personal Travel Blog" },
    ];
}

interface LoaderData {
    name: string;
}
export async function loader(_: Route.LoaderArgs) {
    const name = globalThis.__name;
    globalThis.__name = '';
    return json<LoaderData>({ name });
}

export default function Home() {
    const { name } = useLoaderData<LoaderData>();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-4 text-2xl">
                {name
                    ? `👋 Hello ${name} 👋`
                    : '🚧 Website Currently Planning 🚧'}
            </h1>

            <p>
                Checkout{' '}
                <Link
                    className="underline text-blue-300"
                    to={{ pathname: '/example-form' }}
                >
                    Example Form
                </Link>{' '}
                in Remix
            </p>
        </div>
    );
}
