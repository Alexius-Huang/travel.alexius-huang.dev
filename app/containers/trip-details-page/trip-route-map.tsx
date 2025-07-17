import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type FC,
} from 'react';
import type { LoaderData } from './types';
import { useLoaderData } from 'react-router';
import { createMapComponents, type MapRouteRef } from '~/components/map';
import { trim } from '~/utils/trim';
import { dateFormatter } from '~/data-access/date';
import { Button } from '~/components/button';
import { useHydration } from '~/hooks/use-hydration';
import { throttle } from '~/utils/throttle';
import type { MapRef } from '~/components/map';
import { waitForStyleLoaded } from '~/components/map/util';
import { IconedMapMarker } from '~/components/iconed-map-marker';

export interface TripRouteMapProps {
    className?: string;
}

const INIT_ZOOM = 7;
const LOCATION_FOCUS_ZOOM = 8;
const LOCATION_FOCUS_DURATION = 1000;

export const TripRouteMap: FC<TripRouteMapProps> = ({ className }) => {
    const { tripDetails, routeCoordinates = [] } = useLoaderData<LoaderData>();
    const containerRef = useRef<HTMLElement | null>(null);
    const locationRefs = useRef<Array<HTMLDivElement>>([]);
    const mapRef = useRef<MapRef>(null);
    const mapRoutesRef = useRef<Array<MapRouteRef>>([]);
    const isHydrated = useHydration();

    /**
     *  Sometimes if the scroll restoration is restored in already scrolled
     *  down position, we need to restore the animation also, this flag denotes
     *  that whether the animation is restored or not
     */
    const isAnimationRestoredRef = useRef(false);

    const {
        date: { from, to },
        map: mapOptions,
        locations,
    } = tripDetails;

    const { center: mapOriginalCenter } = mapOptions;

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
    const mapFocusLocationIndexRef = useRef<number>(null);

    const flyToLocation = useCallback(
        (index: number | 'origin') => {
            const mapInstance = mapRef.current?.getMapInstance();
            if (!mapInstance) {
                console.warn(
                    'Map instance is not loaded yet, cannot execute fly to location task',
                );
                return;
            }

            if (index === 'origin') {
                mapInstance.flyTo({
                    center: mapOriginalCenter,
                    zoom: INIT_ZOOM,
                    duration: LOCATION_FOCUS_DURATION,
                    essential: true,
                });
                return;
            }

            /**
             *   The -.5 offset is an estimate to offset the center so that
             *   it is visually balanced when showing the location on the map
             *   on slightly righter side
             **/
            mapInstance.flyTo({
                center: [
                    locations[index].coord[0] - .5,
                    locations[index].coord[1]
                ],
                zoom: LOCATION_FOCUS_ZOOM,
                duration: LOCATION_FOCUS_DURATION,
                essential: true,
            });
        },
        [locations],
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

        const throttledHandleScroll = throttle(handleScroll, 1000 / 120);
        const mainContainer = document.getElementById(
            'main-container',
        ) as HTMLDivElement;
        mainContainer.addEventListener('scroll', throttledHandleScroll);
        return () => {
            mainContainer.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [isHydrated]);

    useEffect(() => {
        if (!isHydrated || !mapRef.current) return;

        const mapInstance = mapRef.current.getMapInstance();
        if (!mapInstance) return;

        const mapFocusLocationIndex = mapFocusLocationIndexRef.current;

        if (scrollProgresses[0] < 20) {
            if (mapFocusLocationIndex === null) return;

            flyToLocation('origin');
            mapFocusLocationIndexRef.current = null;
            return;
        }

        const isAnimationRestored = isAnimationRestoredRef.current;

        (async function animateRoute() {
            for (let i = locations.length - 1; i >= 0; i--) {
                if (scrollProgresses[i] <= 20) continue;

                if (mapFocusLocationIndex === i && isAnimationRestored) return;

                /* Perform Route Animation */
                for (let j = 0; j < i; j++) {
                    mapRoutesRef.current[j].animate();
                }

                /* Revert animation of the next route if found */
                mapRoutesRef.current[i]?.reverseAnimate();

                if (!isAnimationRestored) {
                    await waitForStyleLoaded(mapInstance)[0];
                    setTimeout(() => flyToLocation(i), 250);
                } else {
                    flyToLocation(i);
                }

                mapFocusLocationIndexRef.current = i;

                isAnimationRestoredRef.current = true;
                return;
            }
        })();
    }, [isHydrated, scrollProgresses]);

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
                        <MapPin key={mp.name} {...mp}>
                            <IconedMapMarker
                                size={48}
                                iconUrl='https://placehold.co/48x48'
                                iconAlt='TODO: replace this placeholder'
                            />
                        </MapPin>
                    ))}

                    {routeCoordinates?.map((coords, index) => (
                        <MapRoute
                            ref={(ref) => {
                                if (!ref) return;
                                mapRoutesRef.current[index] = ref;
                            }}
                            key={index}
                            sourceName={`${index}`}
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
                        className={trim`${index !== 0 ? 'mt-[30vh]' : ''} mb-[30vh] max-w-[40%]`}
                        data-index={index}
                        ref={(el) => {
                            if (!el) return;
                            locationRefs.current[index] = el;
                        }}
                    >
                        <div className="w-full h-[30vh]" />
                        <div
                            className={trim`
                                flex flex-col gap-y-[1rem] mb-[-30vh]
                                px-[1.5rem] py-[2rem] w-full
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

            <div className="w-full h-[50vh]" />
        </section>
    );
};
