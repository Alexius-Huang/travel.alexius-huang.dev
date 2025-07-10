// Map.tsx
import { useEffect, useRef, type FC } from 'react';
import L from 'leaflet';

export const Map: FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current).setView([40.7128, -74.006], 13);
        leafletMapRef.current = map;

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Add marker
        L.marker([40.7128, -74.006])
            .addTo(map)
            .bindPopup('New York City 🗽')
            .openPopup();

        // Optional: Cleanup on unmount
        return () => {
            map.remove();
            leafletMapRef.current = null;
        };
    }, []);

    return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};
