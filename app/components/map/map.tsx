import { useEffect, useMemo, useRef, type FC, type HTMLProps } from 'react';
import { Theme, useTheme } from 'remix-themes';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import mapStyle from './map-style.json';
import mapStyleDark from './map-style.dark.json';

export interface MapPin {
    name: string;
    coord: [lat: number, lng: number];
}

export interface MapProps extends HTMLProps<HTMLDivElement> {
    name: string;
    config?: Omit<maplibregl.MapOptions, 'style' | 'container'>;
    mapPins?: MapPin[];
}

export const Map: FC<MapProps> = ({ name, config = {}, mapPins = [] }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
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

        // Add map pins
        mapPins.forEach(pin => {
            new maplibregl.Marker()
                .setLngLat(pin.coord)
                .setPopup(new maplibregl.Popup({ offset: 25 }).setText(pin.name))
                .addTo(mapInstance.current!);
        });

        globalThis.maps ??= {};
        globalThis.maps[name] = mapInstance.current;

        const resizeObserver = new ResizeObserver(() => {
            mapInstance.current?.resize();
        });

        resizeObserver.observe(mapContainer.current);

        return () => {
            mapInstance.current?.remove();
            globalThis.maps && delete globalThis.maps[name];
            maplibregl.removeProtocol('pmtiles');
            resizeObserver.disconnect();
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
        <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
    );
};
