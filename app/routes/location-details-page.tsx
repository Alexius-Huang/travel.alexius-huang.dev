import { FOOTER_HEIGHT } from '~/containers/footer';
import type { Route } from './+types/location-details-page';

/**
 *  TODO: we need to populate correct information on meta tag, checkout:
 *      https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/44
 */
export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `Travel | TO BE UPDATED` },
        { name: 'description', content: `Details of "TO BE UPDATED"` },
    ];
}

// export async function loader({ params }: Route.LoaderArgs) {
//     return json<LoaderData>({ tripDetails, routeCoordinates });
// }

export default function TripDetailsPage() {
    return (
        <div className="centered-max-width-1280">
            <h1
                className='uppercase text-center text-6xl text-blue-500 font-bold'
                style={{ height: `calc(100vh - ${FOOTER_HEIGHT}px)`, lineHeight: `calc(100vh - ${FOOTER_HEIGHT}px)` }}
            >Under Construction</h1>
        </div>
    );
}

export { ErrorBoundary } from './index';
