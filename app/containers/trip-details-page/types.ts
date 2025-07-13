import type { TripDetails } from "~/data-access/trips";

export interface LoaderData {
    tripDetails: TripDetails;
    routeCoordinates?: Array<Array<[lat: number, lng: number]>>;
}
