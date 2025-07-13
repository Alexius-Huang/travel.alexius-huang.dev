import { useMemo } from 'react';
import type { Route } from './+types/trip-details-page';
import { useLoaderData } from 'react-router';
import { Errors, json } from '~/utils/response.server';
import { TRIPS } from '~/utils/trips.server';
import type { TripDetails } from '~/data-access/trips';
import { NavLink } from '~/components/nav-link';
import { daysBetween } from '~/utils/date';
import { dateFormatter } from '~/data-access/date';
import { COUNTRY_INFO_MAP } from '~/data-access/country';
import { CountryFlagChip } from '~/ui/country-flag-chip';
import { TagList } from '~/components/tag-list';
import { CalendarDateRangeOutlineIcon } from '~/icons/outline/calendar-date-range';
import { trim } from '~/utils/trim';
import loadable from '@loadable/component';
import fetch from 'node-fetch';
import { Button } from '~/components/button';

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

interface LoaderData {
    tripDetails: TripDetails;
    routeCoordinates?: Array<Array<[lat: number, lng: number]>>;
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
        title,
        subtitle,
        description,
        tags,
        countryCodes,
        date: { from, to },
        map: mapOptions,
        locations,
    } = tripDetails;

    const daysPassed = useMemo(() => daysBetween(from, to), [from, to]);
    const formattedDate = useMemo(
        () => ({
            from: dateFormatter.format(new Date(from)),
            to: dateFormatter.format(new Date(to)),
        }),
        [from, to],
    );

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

            <article className="px-[1rem]">
                <div className='flex justify-between items-center'>
                    <h1
                        className={trim`
                        v-trans-trip-title mt-8 mb-4
                        font-bold uppercase text-5xl text-blue-500
                    `}
                    >
                        {title}
                    </h1>

                    <div>
                        <NavLink to="/" aria-label="Back to Home Page" viewTransition>
                            Back
                        </NavLink>
                    </div>
                </div>

                <p
                    className={trim`
                    v-trans-trip-subtitle my-3
                    font-medium text-xl tracking-wide text-gray-500 dark:text-gray-300
                `}
                >
                    {subtitle}
                </p>

                <div className="flex flex-row gap-x-[1rem] items-center my-2">
                    <div
                        className={trim`
                        flex items-center gap-x-1.5
                        text-base font-normal text-blue-500 dark:text-yellow-300
                        v-trans-trip-date-range
                    `}
                    >
                        <CalendarDateRangeOutlineIcon size="sm" />
                        <span className="font-semibold font-header mr-1.5">
                            {daysPassed} DAYS
                        </span>
                        <time dateTime={from}>{formattedDate.from}</time>
                        <span aria-hidden="true">~</span>
                        <time dateTime={to}>{formattedDate.to}</time>
                        <span className="sr-only">
                            from {formattedDate.from} to {formattedDate.to}
                        </span>
                    </div>

                    <span
                        aria-hidden="true"
                        className="text-xs font-extrabold mb-1 dark:text-gray-500 text-gray-400"
                    >
                        @
                    </span>

                    <div className="flex flex-row flex-wrap gap-x-2 gap-y-1.5 mb-1 v-trans-trip-country-list">
                        {countryCodes.map((cc) => (
                            <CountryFlagChip
                                key={cc}
                                size="lg"
                                countryCode={cc}
                                name={COUNTRY_INFO_MAP[cc].name}
                                variant="horizontal"
                                className="direction-ltr"
                            />
                        ))}
                    </div>
                </div>

                <p className="text-lg tracking-wide font-light my-6 v-trans-trip-description">
                    {description}
                </p>

                {tags && (
                    <TagList
                        tags={tags}
                        className="v-trans-trip-tags"
                        tagClassName="!text-lg"
                    />
                )}
            </article>

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