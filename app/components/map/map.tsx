import { useEffect, useMemo, useRef, useState, type FC, type HTMLProps, type PropsWithChildren } from 'react';
import { Theme, useTheme } from 'remix-themes';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import mapStyle from './map-style.json';
import mapStyleDark from './map-style.dark.json';
import type { MapInstanceProviderType } from '~/components/map/create-map-components';

export interface MapProps extends HTMLProps<HTMLDivElement> {
    name: string;
    config?: Omit<maplibregl.MapOptions, 'style' | 'container'>;
    routeCoordinates?: Array<[lat: number, lng: number]>;
}

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function geojsomFromCoorindates(coordinates: Array<[lat: number, lng: number]>) {
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

export const Map: (Provider: MapInstanceProviderType) => FC<PropsWithChildren<MapProps>> = (
    Provider
) => ({
    children,
    name,
    config = {},
    routeCoordinates
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

    const [theme] = useTheme();

    const sources = useMemo<maplibregl.StyleSpecification['sources']>(
        () => ({
            protomaps: {
                type: 'vector',
                url: `pmtiles://https://images.alexius-huang.dev/pmtiles/${name}.pmtiles`,
            },
        }),
        [name],
    );

    useEffect(() => {
        if (!mapContainer.current) return;

        const protocol = new Protocol();
        maplibregl.addProtocol('pmtiles', protocol.tile);

        setMapInstance(new maplibregl.Map({
            container: mapContainer.current,
            style: {
                ...(theme === Theme.DARK ? mapStyleDark : mapStyle),
                sources,
            } as maplibregl.StyleSpecification,
            ...config,
        }));
    }, []);

    useEffect(() => {
        if (!mapInstance || !mapContainer.current) return;

        mapInstance.on('load', () => {
            config.center && mapInstance!.setCenter(config.center);
        });

        globalThis.maps ??= {};
        globalThis.maps[name] = mapInstance;

        const resizeObserver = new ResizeObserver(() => {
            mapInstance?.resize();
        });

        resizeObserver.observe(mapContainer.current);

        return () => {
            mapInstance?.remove();
            globalThis.maps && delete globalThis.maps[name];
            maplibregl.removeProtocol('pmtiles');
            resizeObserver.disconnect();
        };
    }, [mapInstance]);

    useEffect(() => {
        if (!mapInstance || !mapInstance.isStyleLoaded())
            return;

        const newStyle = {
            ...(theme === Theme.DARK ? mapStyleDark : mapStyle),
            sources,
        } as maplibregl.StyleSpecification;
        mapInstance.setStyle(newStyle);
    }, [theme, mapInstance]);

    // useEffect(() => {
    //     if (!mapInstance.current || !routeCoordinates) return;
    //     const map = mapInstance.current;

    //     const animationDuration = 1000; // 1 second
    //     let startTime: number | null = null;
    //     let animationFrameId: number;

    //     function animateRoute(timestamp: number) {
    //         if (!mapInstance.current || !routeCoordinates) return;
    //         const map = mapInstance.current;

    //         if (!startTime) startTime = timestamp;
    //         const elapsed = timestamp - startTime;
    //         const progress = Math.min(elapsed / animationDuration, 1);
    //         const easedProgress = easeInOutCubic(progress);

    //         const numCoords = routeCoordinates.length;
    //         const animatedCoords = routeCoordinates.slice(0, Math.floor(numCoords * easedProgress));

    //         if (map.getSource('animated-route')) {
    //             (map.getSource('animated-route') as maplibregl.GeoJSONSource).setData(
    //                 geojsomFromCoorindates(animatedCoords)
    //             );
    //         } else {
    //             map.addSource('animated-route', {
    //                 type: 'geojson',
    //                 data: geojsomFromCoorindates(animatedCoords),
    //             });

    //             map.addLayer({
    //                 id: 'animated-route-line',
    //                 type: 'line',
    //                 source: 'animated-route',
    //                 layout: {
    //                     'line-join': 'round',
    //                     'line-cap': 'round',
    //                 },
    //                 paint: {
    //                     'line-color': '#FF0000', // Red color for the animated route
    //                     'line-width': 3,
    //                 },
    //             });
    //         }

    //         if (progress < 1) {
    //             animationFrameId = requestAnimationFrame(animateRoute);
    //         } else {
    //             // Animation complete, add the full GeoJSON as a static layer
    //             if (map.getSource('route')) {
    //                 (map.getSource('route') as maplibregl.GeoJSONSource).setData(
    //                     geojsomFromCoorindates(routeCoordinates)
    //                 );
    //             } else {
    //                 map.addSource('route', {
    //                     type: 'geojson',
    //                     data: geojsomFromCoorindates(routeCoordinates),
    //                 });
    //                 map.addLayer({
    //                     id: 'route-line',
    //                     type: 'line',
    //                     source: 'route',
    //                     layout: {
    //                         'line-join': 'round',
    //                         'line-cap': 'round',
    //                     },
    //                     paint: {
    //                         'line-color': '#888', // Original color for the static route
    //                         'line-width': 3,
    //                     },
    //                 });
    //             }
    //             // Remove animated layer after animation is complete
    //             if (map.getLayer('animated-route-line')) {
    //                 map.removeLayer('animated-route-line');
    //             }
    //             if (map.getSource('animated-route')) {
    //                 map.removeSource('animated-route');
    //             }
    //         }
    //     };

    //     map.on('load', () => {
    //         animationFrameId = requestAnimationFrame(animateRoute);
    //     });

    //     return () => {
    //         cancelAnimationFrame(animationFrameId);
    //     };
    // }, []);

    return (
        <>
            <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
            <Provider instance={mapInstance}>{children}</Provider>
        </>
    );
};
