import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type FC,
} from 'react';
import type { LoaderData } from './types';
import { useLoaderData, useNavigate } from 'react-router';
import { createMapComponents, type MapRouteRef } from '~/components/map';
import { trim } from '~/utils/trim';
import { useHydration } from '~/hooks/use-hydration';
import { throttle } from '~/utils/throttle';
import type { MapRef } from '~/components/map';
import { waitForStyleLoaded } from '~/components/map/util';
import { IconedMapMarker } from '~/components/iconed-map-marker';
import { TripRouteLocationDetail } from './trip-route-location-detail';
import { Breakpoint, useBreakpoint } from '~/hooks/use-breakpoint';
import './trip-route-map.css';

export interface TripRouteMapProps {
    className?: string;
}

/**
 *   The offset is an estimate to offset the center so that it
 *   is visually balanced when showing the location on the map
 *   on slightly righter side
 **/
const zoomLevelXFocusOffset: Record<number, number> = {
    12: 0.045,
    11: 0.075,
    10: 0.2,
    8: 0.65,
};

const zoomLevelXFocusOffsetLG: Record<number, number> = {
    12: 0.04,
    11: 0.1,
    10: 0.2,
    8: 0.55,
};

const zoomLevelYFocusOffset: Record<number, number> = {
    12: 0.015,
    11: 0.025,
    10: 0.05,
    8: 0.15,
};

const LOCATION_FOCUS_DURATION = 1000;

export const TripRouteMap: FC<TripRouteMapProps> = ({ className }) => {
    const { tripDetails, routeCoordinates = [] } = useLoaderData<LoaderData>();
    const containerRef = useRef<HTMLElement | null>(null);
    const locationRefs = useRef<Array<HTMLDivElement>>([]);
    const mapRef = useRef<MapRef>(null);
    const mapRoutesRef = useRef<Array<MapRouteRef>>([]);
    const isHydrated = useHydration();
    const navigate = useNavigate();
    const breakpoint = useBreakpoint();

    /**
     *  Sometimes if the scroll restoration is restored in already scrolled
     *  down position, we need to restore the animation also, this flag denotes
     *  that whether the animation is restored or not
     */
    const isAnimationRestoredRef = useRef(false);

    const {
        // date: { from, to },
        map: mapOptions,
        locations,
    } = tripDetails;

    const { center: mapOriginalCenter, zoomLevel } = mapOptions;

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
                    zoom: zoomLevel.init,
                    duration: LOCATION_FOCUS_DURATION,
                    essential: true,
                });
                return;
            }

            // When the screen width is large, we display partial width of location
            // info, hence we want to move our focused location a bit right offset
            const zoomLevelXOffset =
                breakpoint >= Breakpoint.LG
                    ? (zoomLevelXFocusOffsetLG[zoomLevel.focus] ?? 0)
                    : breakpoint >= Breakpoint.MD
                      ? (zoomLevelXFocusOffset[zoomLevel.focus] ?? 0)
                      : 0;

            // When the screen width is small, we display full width of location
            // info, hence we want to move our focused location a bit higher
            const zoomLevelYOffset =
                breakpoint >= Breakpoint.MD
                    ? 0
                    : (zoomLevelYFocusOffset[zoomLevel.focus] ?? 0);

            mapInstance.flyTo({
                center: [
                    locations[index].coord[0] - zoomLevelXOffset,
                    locations[index].coord[1] - zoomLevelYOffset,
                ],
                zoom: zoomLevel.focus,
                duration: LOCATION_FOCUS_DURATION,
                essential: true,
            });
        },
        [locations, breakpoint],
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

    const handleMapPinClick = (index: number) => {
        const mapFocusLocationIndex = mapFocusLocationIndexRef.current;

        if (mapFocusLocationIndex === index) {
            navigate(`/location/${locations[index].nameId}`);
            return;
        }

        const mainContainer = document.getElementById(
            'main-container',
        ) as HTMLDivElement;
        if (!mainContainer) return;

        const target = locationRefs.current[index];
        if (!target) return;

        const targetContainer =
            target.querySelector<HTMLDivElement>('div:nth-child(2)');
        if (!targetContainer) return;

        const rect = targetContainer.getBoundingClientRect();
        const scrollTop =
            targetContainer.offsetTop + (rect.height + window.innerHeight) / 2;

        mainContainer.scrollTo({ top: scrollTop, behavior: 'smooth' });
    };

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
                    {mapPins.map((mp, index) => (
                        <MapPin key={mp.name} {...mp}>
                            <IconedMapMarker
                                onClick={() => {
                                    handleMapPinClick(index);
                                }}
                                size={48}
                                iconUrl="https://placehold.co/48x48"
                                iconAlt="TODO: replace this placeholder"
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
                    trip-route-map__edge-gradient
                    top-0 left-0 w-full h-[150px] bg-gradient-to-b
                `}
            />
            <div
                className={trim`
                    trip-route-map__edge-gradient
                    bottom-0 left-0 w-full h-[150px] bg-gradient-to-t
                `}
            />
            <div
                className={trim`
                    trip-route-map__edge-gradient
                    atop-0 left-0 w-[10%] h-full bg-gradient-to-r
                `}
            />
            <div
                className={trim`
                    trip-route-map__edge-gradient
                    top-0 right-0 w-[10%] h-full bg-gradient-to-l
                `}
            />

            {locations.map((location, index) => (
                <TripRouteLocationDetail
                    key={location.name}
                    className="mt-[30vh] mb-[30vh] max-w-full md:max-w-[60%] lg:max-w-[50%]"
                    data-index={index}
                    ref={(el) => {
                        if (!el) return;
                        locationRefs.current[index] = el;
                    }}
                    location={location}
                />
            ))}

            <div className="w-full h-0 md:h-[50vh]" />
        </section>
    );
};
