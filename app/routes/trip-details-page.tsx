import { useMemo } from 'react';
import type { Route } from './+types/trip-details-page';
import { useLoaderData } from 'react-router';
import { Errors, json } from '~/utils/response.server';
import { TRIPS } from '~/utils/trips.server';
import { dateFormatter } from '~/data-access/date';
import type { LoaderData } from '~/containers/trip-details-page/types';
import { trim } from '~/utils/trim';
import loadable from '@loadable/component';
import fetch from 'node-fetch';
import { Button } from '~/components/button';
import { TripIntroduction } from '~/containers/trip-details-page/trip-introduction';

const Map = loadable(() => import('~/components/map').then((m) => m.Map));

/**
 *  TODO: we need to populate correct information on meta tag, checkout:
 *      https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/44
 */
export function meta({ params }: Route.MetaArgs) {
    // const tripDetails = TRIPS.find(t => String(t.id) === params.tripId);

    return [
        { title: `Travel | TO BE UPDATED` },
        { name: 'description', content: `Details of "TO BE UPDATED"` },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    const tripDetails = TRIPS.find((t) => String(t.id) === params.tripId);

    if (!tripDetails) throw Errors.NotFound();

    const routeResponse = await fetch(
        `https://images.alexius-huang.dev/routes/${tripDetails.routeFileName}.json`,
    );

    const routeCoordinates = await routeResponse.json() as LoaderData['routeCoordinates'];

    return json<LoaderData>({ tripDetails, routeCoordinates });
}

export default function TripDetailsPage() {
    const { tripDetails /* routeCoordinates */ } = useLoaderData<LoaderData>();
    const {
        date: { from, to },
        map: mapOptions,
        locations,
    } = tripDetails;

    const mapPins = useMemo(() =>
        locations.map((location) => ({
            name: location.name,
            coord: location.coord,
        })),
        [locations]
    );

    return (
        <div className="centered-max-width-1280">
            <div
                style={{
                    backgroundImage: `url(https://placehold.co/960x560?text=Placeholder)`,
                }}
                className="w-full h-[560px] bg-cover bg-no-repeat"
            />

            <TripIntroduction className="px-[1rem]" />

            <div className="flex gap-x-4 mt-8">
                {/**
                 *  TODO: design back button, checkout following ticket:
                 *        https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/40
                 */}

                {/**
                 *  TODO: creates next / previous trip button, checkout following ticket:
                 *        https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/41
                 */}
                {/* <NavLink to={`/trips/${tripDetails.id + 1}`} aria-label='Next Trip'>Next Trip</NavLink> */}
            </div>

            <h2 className='font-bold uppercase text-4xl text-blue-500 text-center my-[4rem]'>
                Trip Main Route
            </h2>

            <div className='relative w-full z-1 flex flex-col'>
                <div
                    style={{ height: '100vh', width: '100%' }}
                    className='sticky top-0 left-0 z-[-1]'
                >
                    <Map
                        fallback={<>Loading...</>}
                        name={mapOptions.pmtilesName}
                        config={{ ...mapOptions, interactive: false }}
                        mapPins={mapPins}
                        // routeCoordinates={routeCoordinates}
                    />
                </div>
                <div
                    className={trim`
                        absolute top-0 left-0 z-[-1] w-[10%] h-full
                        bg-gradient-to-r from-white dark:from-gray-900 to-transparent
                        pointer-events-none
                    `}
                />
                <div
                    className={trim`
                        absolute top-0 right-0 z-[-1] w-[10%] h-full
                        bg-gradient-to-l from-white dark:from-gray-900 to-transparent
                        pointer-events-none
                    `}
                />


                <div className='w-full h-full' />

                {locations.map(({
                    name,
                    description,
                    date
                }) => {
                    const formattedDate = {
                        from: dateFormatter.format(new Date(date.from)),
                        to: date.to ? dateFormatter.format(new Date(to)) : undefined,
                    };

                    return (
                        <div className='mb-[100vh]' key={name}>
                            <div className={trim`
                                flex flex-col gap-y-[1rem]
                                px-[1.5rem] py-[2rem] max-w-[40%]
                                shadow-lg shadow-gray-100 dark:shadow-gray-900
                                backdrop-blur-xs bg-white/50 dark:bg-gray-900/50
                            `}>
                                <h3 className='text-4xl uppercase font-bold'>
                                    {name}
                                </h3>
                                
                                <div className='text-sm'>
                                    <time dateTime={from}>{formattedDate.from}</time>
                                    <span aria-hidden="true"> ~ </span>
                                    <time dateTime={to}>{formattedDate.to}</time>
                                    <span className="sr-only">
                                        from {formattedDate.from}
                                        {formattedDate.to ? `to ${formattedDate.to}` : ''}
                                    </span>
                                </div>

                                <p className='text-base font-light'>
                                    {description}
                                </p>

                                <span className='self-end'>
                                    <Button variant='secondary' size='xs'>
                                        View Details (WIP)
                                    </Button>
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div className='pb-[10vh] w-full' />
            </div>
        </div>
    );
}

export { ErrorBoundary } from './index';