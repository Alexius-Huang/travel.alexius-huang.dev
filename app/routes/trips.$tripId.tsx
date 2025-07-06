import { type FC } from 'react';
import type { Route } from './+types/trips.$tripId';
import { useLoaderData } from 'react-router';
import { json } from '~/utils/response.server';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: 'Travel | Alexius Huang' },
        { name: 'description', content: `Details of trip where tripId is ${params.tripId}` },
    ];
}

interface LoaderData {
    tripId: string;
}
export async function loader({ params }: Route.LoaderArgs) {
    return json<LoaderData>({ tripId: params.tripId });
};

const TripDetailsPage: FC = () => {
    const { tripId } = useLoaderData<LoaderData>();

    return (
        <div className='centered-max-width-960'>
            <h1>Trip Details</h1>
            <p>Trip ID: {tripId}</p>
        </div>
    );
};

export default TripDetailsPage;
