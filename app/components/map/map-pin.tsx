import { useEffect, type FC } from 'react';
import type { UseMapInstanceType } from '~/components/map/create-map-components';
import maplibregl from 'maplibre-gl';

export interface MapPinProps {
    coord: maplibregl.LngLatLike;
    name: string;
}

export const MapPin: (useMapInstance: UseMapInstanceType) => FC<MapPinProps> =
    (useMapInstance) =>
    ({ coord, name }) => {
        const mapInstance = useMapInstance();

        useEffect(() => {
            if (!mapInstance) return;

            mapInstance.on('load', () => {
                new maplibregl.Marker()
                    .setLngLat(coord)
                    .setPopup(
                        new maplibregl.Popup({ offset: 25 }).setText(name),
                    )
                    .addTo(mapInstance!);
            });
        }, [mapInstance]);

        return <></>;
    };
