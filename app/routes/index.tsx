import { json } from '~/utils/response.server';
import type { Route } from './+types/index';
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
    return (
        <div className="h-screen overflow-y-scroll pb-[300px]">
            <TravelHighlight className="my-0 mx-auto max-w-[960px]" />
        </div>
    );
}
