import { FOOTER_HEIGHT } from '~/containers/footer';
import type { Route } from './+types/location-details-page';

// export async function loader({ params }: Route.LoaderArgs) {
//     return json<LoaderData>({ tripDetails, routeCoordinates });
// }

export function meta({ matches }: Route.MetaArgs) {
    // const matched = matches.find(m => m && m.id === 'routes/location-details-page');
    // const { tripDetails } = matched?.data as LoaderData;

    return [
        { title: `Travel | TO BE UPDATED` },
        { name: 'description', content: `Details of "TO BE UPDATED"` },
    ];
}

export default function TripDetailsPage() {
    return (
        <div className="centered-max-width-1280">
            <h1
                className="uppercase text-center text-6xl text-blue-500 font-bold"
                style={{
                    height: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                    lineHeight: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                }}
            >
                Under Construction
            </h1>
        </div>
    );
}

export { ErrorBoundary } from './index';
