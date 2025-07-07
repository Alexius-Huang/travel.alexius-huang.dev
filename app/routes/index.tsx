import { json } from '~/utils/response.server';
import type { Route } from './+types/index';
import { TravelHighlight } from '~/containers/index/travel-highlight';
import { TravelStats } from '~/containers/index/travel-stats/travel-stats';
import { TripTimeline } from '~/containers/index/trip-timeline';
import { trim } from '~/utils/trim';
import type { TripDetails } from '~/data-access/trips';
import { TRIPS } from '~/utils/trips.server';
import { isResponseError } from '~/utils/response';
import { useContext } from 'react';
import { MinContainerHeightContext } from '~/contexts/min-container-height-provider';
import { NavLink } from '~/components/nav-link';

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
    // throw '123';
    /* const {} = useLoaderData<LoaderData>(); */
    return (
        <>
            <TravelHighlight className="my-0 centered-max-width-1280" />
            <TravelStats className="my-0 centered-max-width-1280 pt-12" />

            <p className="hidden centered-max-width-1280 mt-[4rem] md:block text-center opacity-50">
                🚧 My Journey Timeline is Currently Under Construction 🚧 <br />
                😊 Following is a Preview Version 😊
            </p>

            {/**
             *  TODO: Handle responsiveness of the trip-timeline section, checkout:
             *        https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/43
             */}
            <TripTimeline
                className={trim`
                    hidden md:block centered-max-width-1280
                    my-0 pt-24 px-[2rem]
                `}
            />
        </>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    const { status, message } = isResponseError(error) ? {
        status: error.status,
        message: error.data.message
    } : {
        status: 404,
        message: 'Not Found'
    };

    const minContainerHeight = useContext(MinContainerHeightContext);

    return (
        <div
            className='centered-max-width-1280 text-center flex flex-col items-center justify-center'
            style={{ height: `${minContainerHeight}px` }}
        >
            <h1 className='text-blue-500 text-[7rem] font-black leading-12'>
                {status}
                <br />
                <span className='text-white text-4xl uppercase'>{message}</span>
            </h1>

            <NavLink to='/' className='mt-12'>
                Back to Home Page
            </NavLink>
        </div>
    );
}
