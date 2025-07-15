import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import type { LoaderData } from './types';
import { useLoaderData } from 'react-router';
import { createMapComponents } from '~/components/map';
import { trim } from '~/utils/trim';
import { dateFormatter } from '~/data-access/date';
import { Button } from '~/components/button';
import { useHydration } from '~/hooks/use-hydration';
import { throttle } from '~/utils/throttle';
import type { MapRef } from '~/components/map';

export interface TripRouteMapProps {
    className?: string;
}

const initZoom = 7;
const cityZoom = 8;

export const TripRouteMap: FC<TripRouteMapProps> = ({ className }) => {
    const { tripDetails, routeCoordinates = [] } = useLoaderData<LoaderData>();
    const containerRef = useRef<HTMLElement | null>(null);
    const locationRefs = useRef<Array<HTMLDivElement>>([]);
    const mapRef = useRef<MapRef>(null);
    const isHydrated = useHydration();
    const {
        date: { from, to },
        map: mapOptions,
        locations,
    } = tripDetails;

    const {
        center: mapOriginalCenter
    } = mapOptions;

    const mapPins = useMemo(
        () =>
            locations.map((location) => ({
                name: location.name,
                coord: location.coord,
            })),
        [locations],
    );

    const { Map, MapPin, MapRoute } = useMemo(createMapComponents, []);

    const [scrollProgresses, setScrollProgresses] = useState(
        Array(locations.length).fill(0),
    );

    useEffect(() => {
        if (!isHydrated) return;

        function handleScroll() {
            // By default, fill every progress as full and if the very last element
            // is already invisible and is already scrolled, we set the default value
            const progresses: Array<number> = Array(locations.length).fill(100);

            /**
             *  We loop from the last element to top, because if the last nth element is
             *  already visible, we can skip the calculation of the element previous than
             *  last nth element and fill them simply as progress 100%
             */
            for (let i = locations.length - 1; i >= 0; i--) {
                const el = locationRefs.current[i];
                if (!el) continue;

                const rect = el.getBoundingClientRect();

                /**
                 *   If the very last element is already scrolled,
                 *   fill everything with 100% progress
                 **/
                if (rect.bottom <= 0) break;

                const visibleInViewport =
                    rect.top < window.innerHeight && rect.bottom > 0;

                /**
                 *  If it is not visible in the viewport, that means it is not
                 *  scrolled yet, hence the progress is 0, we loop again to check
                 *  the previous element
                 */
                if (!visibleInViewport) {
                    progresses[i] = 0;
                    continue;
                }

                /**
                 *  If the nth last element is visible, we calculate the current
                 *  element's progress and fill the rest with 100%
                 */
                const progress =
                    ((window.innerHeight - rect.top) / window.innerHeight) *
                    100;
                progresses[i] = progress > 100 ? 100 : progress;
                i !== 0 && progresses.fill(100, 0, i - 1);
                break;
            }

            setScrollProgresses(progresses);
        }

        /* Initial check on mount */
        handleScroll();

        const throttledHandleScroll = throttle(handleScroll, 1000 / 30);
        const mainContainer = document.getElementById(
            'main-container',
        ) as HTMLDivElement;
        mainContainer.addEventListener('scroll', throttledHandleScroll);
        return () => {
            mainContainer.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [isHydrated]);

    useEffect(() => {
        const mapInstance = mapRef.current?.getMapInstance();
        if (!mapInstance || scrollProgresses.every(p => p === 100) || scrollProgresses.every(p => p === 0)) return;

        /**
         *  TODO: Instead of continuous scroll, maybe we can use intersection observer to check if the city
         *        is intersecting, then we animate that route directly without having laggy animation
         */

        /**
         *  If the first location's scroll progress is not 100%, we need to animate both Zoom and location
         **/
        if (scrollProgresses[0] !== 100) {
            const percentage = scrollProgresses[0] / 100;

            const zoomDelta = (cityZoom - initZoom) * percentage;

            const newPositionLng = (locations[0].coord[0] - mapOriginalCenter[0]) * percentage;
            const newPositionLat = (locations[0].coord[1] - mapOriginalCenter[1]) * percentage;

            const newPosition = [newPositionLng + mapOriginalCenter[0], newPositionLat + mapOriginalCenter[1]];

            mapInstance.flyTo({
                center: newPosition,
                zoom: zoomDelta + initZoom,
                duration: 1000 / 60
            });
            return;
        }

        /**
         *  For nth location, we need to interpolate between (n - 1)th and nth location's coordinate 
         */
        const n = scrollProgresses.slice(1).findIndex(p => p !== 100) + 1;
        const destinationCoord = locations[n].coord;
        const fromCoord = locations[n - 1].coord;

        const percentage = scrollProgresses[n] / 100;
        const newPositionLng = (destinationCoord[0] - fromCoord[0]) * percentage;
        const newPositionLat = (destinationCoord[1] - fromCoord[1]) * percentage;

        // let zoom = cityZoom;
        // if (n === 0) {
        //     const zoomDelta = (cityZoom - initZoom) * percentage;
        //     zoom = initZoom + zoomDelta;            
        // }

        // mapInstance.setCenter([newPositionLng + mapOriginalCenter[0], newPositionLat + mapOriginalCenter[1]]);
        const newPosition = [newPositionLng + fromCoord[0], newPositionLat + fromCoord[1]];
        mapInstance.flyTo({
            center: newPosition,
            // zoom,
            // zoom: zoomDelta + initZoom,
            duration: 1000 / 60
        });



    }, [scrollProgresses, locations]);

    return (
        <section
            className={`relative w-full z-1 flex flex-col ${className}`}
            ref={containerRef}
        >
            <div
                style={{ height: '100vh', width: '100%' }}
                className="sticky top-0 left-0 z-[-1]"
            >
                <Map
                    name={mapOptions.pmtilesName}
                    config={{ ...mapOptions, interactive: false }}
                    routeCoordinates={routeCoordinates?.[0]}
                    ref={mapRef}
                >
                    {mapPins.map((mp) => (
                        <MapPin key={mp.name} {...mp} />
                    ))}

                    {routeCoordinates?.map((coords, index) => (
                        <MapRoute
                            key={index}
                            sourceName={`${index}`}
                            coords={coords}
                            lineProgress={scrollProgresses[index + 1] || 0}
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

            {locations.map(({ name, description, date }, index) => {
                const formattedDate = {
                    from: dateFormatter.format(new Date(date.from)),
                    to: date.to
                        ? dateFormatter.format(new Date(to))
                        : undefined,
                };

                return (
                    <div
                        key={name}
                        className="mt-[45vh] py-[25vh] mb-[5vh]"
                        ref={(el) => {
                            if (!el) return;
                            locationRefs.current[index] = el;
                        }}
                    >
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
