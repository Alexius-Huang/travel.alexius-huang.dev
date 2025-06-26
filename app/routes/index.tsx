import { json } from '~/utils/response.server';
import type { Route } from './+types/index';
import { useState } from 'react';
import { TravelHighlight } from '~/containers/index/travel-highlight';

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
    const [index, setIndex] = useState(0);

    return (
        <div className="h-screen overflow-y-scroll pb-[300px]">
            <TravelHighlight />
        </div>
    );
}
