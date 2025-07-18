import type { DateFormat } from './date';

export interface TripLocation {
    name: string;
    nameId: string;
    description: string;
    coord: [lng: number, lat: number];
    date: { from: DateFormat; to?: DateFormat };
}

export interface TripDetails {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    tags?: Array<string>;
    countryCodes: Array<string>;
    date: { from: DateFormat; to: DateFormat };

    map: Omit<maplibregl.MapOptions, 'style' | 'container'> & {
        pmtilesName: string;
        center: maplibregl.LngLatLike;
        zoomLevel: {
            init: number;
            focus: number;
        };
    };
    routeFileName: string;

    locations: Array<TripLocation>;

    // TODO: Plan for cities data and associated attraction data
}
