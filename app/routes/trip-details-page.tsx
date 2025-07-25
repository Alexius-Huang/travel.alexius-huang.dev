import type { Route } from './+types/trip-details-page';
import { Errors, json } from '~/utils/response.server';
import { TRIPS } from '~/utils/trips.server';
import type { LoaderData } from '~/containers/trip-details-page/types';
import { TripIntroduction } from '~/containers/trip-details-page/trip-introduction';
import { TripRouteMap } from '~/containers/trip-details-page/trip-route-map';

// Pick every nth coordinate, this is a naive approach to reduce the number of coordinate being
// sent to client; we do not need high accurate navigation level
const SPARSITY = 10;
export async function loader({ params }: Route.LoaderArgs) {
    const tripDetails = TRIPS.find((t) => String(t.id) === params.tripId);

    if (!tripDetails) throw Errors.NotFound();

    const routeResponse = await fetch(
        `https://images.alexius-huang.dev/routes/${tripDetails.routeFileName}.json`,
    );

    let routeCoordinates =
        (await routeResponse.json()) as LoaderData['routeCoordinates'];

    routeCoordinates = routeCoordinates?.map((coords) =>
        coords.filter((_, i) => i % SPARSITY === 0),
    );

    return json<LoaderData>({ tripDetails, routeCoordinates });
}

export function meta({ matches }: Route.MetaArgs) {
    const matched = matches.find(m => m && m.id === 'routes/trip-details-page');
    const { tripDetails } = matched?.data as LoaderData;

    return [
        { title: `Trip Details | ${tripDetails.title}` },
        { name: 'description', content: `Expore the trip details: ${tripDetails.title}` },
    ];
}

export default function TripDetailsPage() {
    return (
        <div className="centered-max-width-1280">
            <div
                style={{
                    backgroundImage: `url(https://placehold.co/960x560?text=Placeholder)`,
                }}
                className="w-full h-[560px] bg-cover bg-no-repeat"
            />

            <TripIntroduction className="px-[1rem]" />

            <h2 className="font-bold uppercase text-4xl text-blue-500 text-center my-[4rem]">
                Trip Main Route
            </h2>

            <TripRouteMap />
        </div>
    );
}

export { ErrorBoundary } from './index';
