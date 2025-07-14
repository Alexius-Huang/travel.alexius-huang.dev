import { useMemo, type FC } from 'react';
import type { LoaderData } from './types';
import { useLoaderData } from 'react-router';
import { createMapComponents } from '~/components/map';
import { trim } from '~/utils/trim';
import { dateFormatter } from '~/data-access/date';
import { Button } from '~/components/button';

export interface TripRouteMapProps {
    className?: string;
}

export const TripRouteMap: FC<TripRouteMapProps> = ({ className }) => {
    const { tripDetails, routeCoordinates } = useLoaderData<LoaderData>();
    const {
        date: { from, to },
        map: mapOptions,
        locations,
    } = tripDetails;

    const mapPins = useMemo(
        () =>
            locations.map((location) => ({
                name: location.name,
                coord: location.coord,
            })),
        [locations],
    );

    const { Map, MapPin, MapRoute } = useMemo(createMapComponents, []);

    return (
        <section className={`relative w-full z-1 flex flex-col ${className}`}>
            <div
                style={{ height: '100vh', width: '100%' }}
                className="sticky top-0 left-0 z-[-1]"
            >
                <Map
                    name={mapOptions.pmtilesName}
                    config={{ ...mapOptions, interactive: false }}
                    routeCoordinates={routeCoordinates?.[0]}
                >
                    {mapPins.map((mp) => (
                        <MapPin key={mp.name} {...mp} />
                    ))}

                    {routeCoordinates?.map((coords, index) => (
                        <MapRoute
                            key={index}
                            sourceName={`route-${index}`}
                            coords={coords}
                        />
                    ))}
                </Map>
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

            <div className="w-full h-full" />

            {locations.map(({ name, description, date }) => {
                const formattedDate = {
                    from: dateFormatter.format(new Date(date.from)),
                    to: date.to
                        ? dateFormatter.format(new Date(to))
                        : undefined,
                };

                return (
                    <div className="mb-[100vh]" key={name}>
                        <div
                            className={trim`
                            flex flex-col gap-y-[1rem]
                            px-[1.5rem] py-[2rem] max-w-[40%]
                            shadow-lg shadow-gray-100 dark:shadow-gray-900
                            backdrop-blur-xs bg-white/50 dark:bg-gray-900/50
                        `}
                        >
                            <h3 className="text-4xl uppercase font-bold">
                                {name}
                            </h3>

                            <div className="text-sm">
                                <time dateTime={from}>
                                    {formattedDate.from}
                                </time>
                                <span aria-hidden="true"> ~ </span>
                                <time dateTime={to}>{formattedDate.to}</time>
                                <span className="sr-only">
                                    from {formattedDate.from}
                                    {formattedDate.to
                                        ? `to ${formattedDate.to}`
                                        : ''}
                                </span>
                            </div>

                            <p className="text-base font-light">
                                {description}
                            </p>

                            <span className="self-end">
                                <Button variant="secondary" size="xs">
                                    View Details (WIP)
                                </Button>
                            </span>
                        </div>
                    </div>
                );
            })}

            <div className="pb-[10vh] w-full" />
        </section>
    );
};
