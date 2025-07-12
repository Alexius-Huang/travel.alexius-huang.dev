import { useEffect, useRef, type FC } from 'react';
import maplibregl, { LngLat, LngLatBounds } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import mapStyle from './map-style.json';

export const Map: FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const protocol = new Protocol();
        maplibregl.addProtocol('pmtiles', protocol.tile);

        mapInstance.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                ...mapStyle,
                sources: {
                    protomaps: {
                        type: 'vector',
                        url: 'pmtiles://https://images.alexius-huang.dev/pmtiles/new-york.pmtiles',
                    },
                },
            } as maplibregl.StyleSpecification,
            maxBounds: new LngLatBounds([
                new LngLat(-74.176123, 40.653505),
                new LngLat(-73.771575, 40.868387),
            ]),
            center: [-74.006, 40.7128],
            minZoom: 12,
            maxZoom: 16,
        });

        return () => {
            mapInstance.current?.remove();
            maplibregl.removeProtocol('pmtiles');
        };
    }, []);

    return (
        <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
    );
};
