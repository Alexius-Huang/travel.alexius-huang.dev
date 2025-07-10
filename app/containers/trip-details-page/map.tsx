// MapLibreMap.tsx
import { useEffect, useRef, type FC } from 'react';
import maplibregl from 'maplibre-gl';

export const Map: FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: '/toner-map-style.json',
            center: [-74.006, 40.7128], // NYC
            zoom: 13,
        });

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
    );
};
