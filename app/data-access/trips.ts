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
    routeFileName: string;

    locations: Array<{
        name: string;
        description: string;
        coord: [lat: number, lng: number];
        date: { from: DateFormat; to?: DateFormat };
    }>;

    // TODO: Plan for cities data and associated attraction data
}
