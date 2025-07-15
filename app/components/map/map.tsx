import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    type FC,
    type HTMLProps,
    type PropsWithChildren,
} from 'react';
import { Theme, useTheme } from 'remix-themes';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import mapStyle from './map-style.json';
import mapStyleDark from './map-style.dark.json';
import type { MapInstanceProviderType } from '~/components/map/create-map-components';
import { useHydration } from '~/hooks/use-hydration';

export interface MapProps extends HTMLProps<HTMLDivElement> {
    name: string;
    config?: Omit<maplibregl.MapOptions, 'style' | 'container'>;
    routeCoordinates?: Array<[lat: number, lng: number]>;
}

// function easeInOutCubic(t: number) {
//     return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// }

export interface MapRef {
    getMapInstance: () => maplibregl.Map | null;
}

export const Map = (Provider: MapInstanceProviderType) =>
    forwardRef<MapRef, MapProps>(
        (
            {
                children,
                name,
                config = {},
                // routeCoordinates
            },
            ref,
        ) => {
            const mapContainer = useRef<HTMLDivElement>(null);
            const [mapInstance, setMapInstance] =
                useState<maplibregl.Map | null>(null);
            const hydrated = useHydration();

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

            useImperativeHandle(ref, () => ({
                getMapInstance() {
                    return mapInstance;
                },
            }));

            useEffect(() => {
                if (!hydrated || !mapContainer.current) return;

                const protocol = new Protocol();
                maplibregl.addProtocol('pmtiles', protocol.tile);

                const mapInstance = new maplibregl.Map({
                    container: mapContainer.current,
                    style: {
                        ...(theme === Theme.DARK ? mapStyleDark : mapStyle),
                        sources,
                    } as maplibregl.StyleSpecification,
                    ...config,
                });

                setMapInstance(mapInstance);
            }, [hydrated]);

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
                if (!mapInstance || !mapInstance.isStyleLoaded()) return;

                const newStyle = {
                    ...(theme === Theme.DARK ? mapStyleDark : mapStyle),
                    sources: mapInstance.getStyle().sources,
                    layers: [
                        ...(theme === Theme.DARK ? mapStyleDark : mapStyle)
                            .layers,

                        // Any layers whose name starts with `$` means it is our
                        // custom added layers, we need to apply this everytime when
                        // the them changes to prevent from custom layer removal
                        ...mapInstance
                            .getStyle()
                            .layers.filter((l) => l.id.startsWith('$')),
                    ],
                } as maplibregl.StyleSpecification;
                mapInstance.setStyle(newStyle);
            }, [theme, mapInstance]);

            return (
                <>
                    <div
                        ref={mapContainer}
                        style={{ height: '100%', width: '100%' }}
                    />
                    <Provider instance={mapInstance}>{children}</Provider>
                </>
            );
        },
    );
