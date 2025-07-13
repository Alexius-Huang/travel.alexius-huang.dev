import type { DateFormat } from './date';

export interface TripDetails {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    tags?: Array<string>;
    countryCodes: Array<string>;
    date: { from: DateFormat; to: DateFormat };

    map: {
        pmtilesName: string;
    } & Omit<maplibregl.MapOptions, 'style' | 'container'>;
    mapPins: Array<{
        name: string;
        coord: [lat: number, lng: number];
    }>;
    routeFileName: string;

    // TODO: Plan for cities data and associated attraction data
}
