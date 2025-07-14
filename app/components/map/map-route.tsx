import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import type { UseMapInstanceType } from '~/components/map/create-map-components';
import maplibregl from 'maplibre-gl';
import { usePrevious } from '~/hooks/use-previous';
import { Theme, useTheme } from 'remix-themes';

type Coordinate = [lat: number, lng: number];

export interface MapRouteProps {
    coords: Array<Coordinate>;
    sourceName: string;
}

function geojsomFromCoorindates(coordinates: Array<Coordinate>) {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates,
                },
            },
        ],
    } as GeoJSON.GeoJSON;
}

export const MapRoute: (useMapInstance: UseMapInstanceType) => FC<MapRouteProps> =
    (useMapInstance) =>
    ({ coords, sourceName }) => {
        const mapInstance = useMapInstance();
        const [theme] = useTheme();

        const previousSourceName = usePrevious(sourceName);
        const layerName = `$route-${sourceName}`;

        const renderLines = useCallback(() => {
            if (!mapInstance) return;

            if (mapInstance.getLayer(layerName)) {
                mapInstance.removeLayer(layerName);
            }
            if (mapInstance.getSource(sourceName)) {
                mapInstance.removeSource(sourceName);
            }

            mapInstance.addSource(sourceName, {
                type: 'geojson',
                data: geojsomFromCoorindates(coords),
            });
            mapInstance.addLayer({
                id: `$route-${sourceName}`,
                type: 'line',
                source: sourceName,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': theme === Theme.DARK ? 'red' : 'blue', // Original color for the static route
                    'line-width': 3,
                },
            });
        }, [layerName, coords, mapInstance, theme]);

        useEffect(() => {
            if (!mapInstance) return;
            mapInstance.on('load', renderLines);
        }, [mapInstance]);


        useEffect(() => {
            if (!mapInstance || !previousSourceName || previousSourceName === sourceName) return;
            mapInstance.removeLayer(`$route-${previousSourceName}`)
            mapInstance.removeSource(previousSourceName);
        }, [previousSourceName]);

        useEffect(() => {
            if (!mapInstance || !mapInstance.isStyleLoaded()) return;

            mapInstance.setPaintProperty(layerName, 'line-color', theme === Theme.DARK ? 'red' : 'blue');
        }, [mapInstance, theme, sourceName]);

        return <></>;
    };
