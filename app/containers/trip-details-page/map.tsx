import { useEffect, useMemo, useRef, type FC } from 'react';
import maplibregl, { LngLat, LngLatBounds } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import mapStyle from './map-style.json';
import mapStyleDark from './map-style.dark.json';
import { Theme, useTheme } from 'remix-themes';

export interface MapProps {
    name: string;
    config?: Omit<maplibregl.MapOptions, 'style' | 'container'>;
}

export const Map: FC<MapProps> = ({ name, config = {} }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
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

        mapInstance.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                ...(theme === Theme.DARK ? mapStyleDark : mapStyle),
                sources,
            } as maplibregl.StyleSpecification,
            ...config,
        });

        return () => {
            mapInstance.current?.remove();
            maplibregl.removeProtocol('pmtiles');
        };
    }, []);

    useEffect(() => {
        if (!mapInstance.current || !mapInstance.current.isStyleLoaded())
            return;

        const newStyle = {
            ...(theme === Theme.DARK ? mapStyleDark : mapStyle),
            sources,
        } as maplibregl.StyleSpecification;
        mapInstance.current.setStyle(newStyle);
    }, [theme]);

    return (
        <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
    );
};
