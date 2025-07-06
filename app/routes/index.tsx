import { json } from '~/utils/response.server';
import type { Route } from './+types/index';
import { TravelHighlight } from '~/containers/index/travel-highlight';
import { TravelStats } from '~/containers/index/travel-stats/travel-stats';
import { TripTimeline } from '~/containers/index/trip-timeline';
import { trim } from '~/utils/trim';
import type { TripDetails } from '~/data-access/trips';
import { TRIPS } from '~/utils/trips.server';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Travel | Alexius Huang' },
        { name: 'description', content: "Alexius's Personal Travel Blog" },
    ];
}

export interface HomePageLoaderData {
    trips: Array<TripDetails>;
}

export async function loader(_: Route.LoaderArgs) {
    return json<HomePageLoaderData>({
        trips: TRIPS,
    });
}

export default function Home() {
    /* const {} = useLoaderData<LoaderData>(); */
    return (
        <>
            <TravelHighlight className="my-0 centered-max-width-960" />
            <TravelStats className="my-0 centered-max-width-960 pt-12" />

            <p className="hidden centered-max-width-960 mt-[4rem] md:block text-center opacity-50">
                🚧 My Journey Timeline is Currently Under Construction 🚧 <br />
                😊 Following is a Preview Version 😊
            </p>

            {/**
             *  TODO: Handle responsiveness of the trip-timeline section, checkout:
             *        https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/43
             */}
            <TripTimeline
                className={trim`
                    hidden md:block centered-max-width-960
                    my-0 pt-24 px-[2rem]
                `}
            />
        </>
    );
}
