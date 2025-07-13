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
        bounds: maplibregl.LngLatBoundsLike;
        minZoom?: number;
        maxZoom?: number;
        center?: maplibregl.LngLatLike;
    };

    // TODO: Plan for cities data and associated attraction data
}
