import { json } from '~/utils/response.server';
import type { Route } from './+types/index';
import { TravelHighlight } from '~/containers/index/travel-highlight';
import { TravelStats } from '~/containers/index/travel-stats/travel-stats';
import { TripTimeline } from '~/containers/index/trip-timeline';
import { trim } from '~/utils/trim';

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
        <>
            <TravelHighlight className="my-0 mx-auto max-w-[960px]" />
            <TravelStats className="my-0 mx-auto max-w-[960px] pt-12" />

            <p className='hidden mx-auto mt-[4rem] md:block text-center max-w-[960px] text-balance opacity-50'>
                🚧 My Journey Timeline is Currently Under Construction 🚧 <br/>
                😊 Following is a Preview Version 😊
            </p>
            <TripTimeline
                className={trim`
                hidden md:block
                my-0 mx-auto pt-24 px-[2rem] max-w-[960px]
            `}
            />
        </>
    );
}
