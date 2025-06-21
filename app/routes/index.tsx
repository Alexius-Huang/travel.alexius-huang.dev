import { json } from '~/utils/response.server';
import type { Route } from './+types/index';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Travel | Alexius Huang' },
        { name: 'description', content: "Alexius's Personal Travel Blog" },
    ];
}

interface LoaderData {}
export async function loader(_: Route.LoaderArgs) {
    return json<LoaderData>({});
}

export default function Home() {
    /* const {} = useLoaderData<LoaderData>(); */

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-4 text-2xl">
                🚧 Website Currently Planning 🚧
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
