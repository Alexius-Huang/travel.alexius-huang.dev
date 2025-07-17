import { useEffect, useRef, type FC, type PropsWithChildren } from 'react';
import type { UseMapInstanceType } from '~/components/map/create-map-components';
import maplibregl from 'maplibre-gl';
import { useHydration } from '~/hooks/use-hydration';

export interface MapPinProps {
    coord: maplibregl.LngLatLike;
    name?: string;
}

export const MapPin: (useMapInstance: UseMapInstanceType) => FC<PropsWithChildren<MapPinProps>> =
    (useMapInstance) =>
    ({ coord, children }) => {
        const mapInstance = useMapInstance();
        const markerRef = useRef<maplibregl.Marker>(null);
        const markerElementRef = useRef<HTMLDivElement>(null);
        const isHydrated = useHydration();

        useEffect(() => {
            if (!isHydrated || !mapInstance) return;

            const el = markerElementRef.current;

            mapInstance.on('load', () => {
                markerRef.current = new maplibregl.Marker({ element: el ?? undefined })
                    .setLngLat(coord)
                    // .setPopup(
                    //     new maplibregl.Popup({ offset: 25 }).setText(name),
                    // )
                    .addTo(mapInstance);
            });
        }, [mapInstance, isHydrated]);

        return (
            <div ref={markerElementRef}>
                {children}
            </div>
        );
    };
