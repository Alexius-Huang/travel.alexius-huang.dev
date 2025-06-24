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

// const imageBaseUrl = 'https://images.alexius-huang.dev';
// const BannerConfig = [
//     {
//         title: 'GREECE',
//         date: [2024, 5],
//         desktop: `${imageBaseUrl}/highlight/gr-oia-landscape.webp`,
//         mobile: `${imageBaseUrl}/highlight/gr-santorini-vert-2.webp`
//     },
//     {
//         title: 'EGYPT',
//         date: [2024, 9],
//         desktop: `${imageBaseUrl}/highlight/egp-gize-landscape.webp`,
//         mobile: `${imageBaseUrl}/highlight/egp-gize-vert.webp`
//     }
// ];

export default function Home() {
    /* const {} = useLoaderData<LoaderData>(); */

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-4 text-2xl">🚧 Website Currently Planning 🚧</h1>

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
