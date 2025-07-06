import type { Route } from './+types/trip-details-page';
import { useLoaderData } from 'react-router';
import { json } from '~/utils/response.server';
import { TRIPS } from '~/utils/trips.server';
import type { TripDetails } from '~/data-access/trips';
import { NavLink } from '~/components/nav-link';
import './trip-details-page.css';

export function meta({ params }: Route.MetaArgs) {
    // const { tripDetails } = useLoaderData<LoaderData>();
    // const tripDetails = TRIPS.find(t => String(t.id) === params.tripId);

    return [
        { title: 'Travel | Alexius Huang' },
        { name: 'description', content: `Details of "${params.tripId}"` },
    ];
}

interface LoaderData {
    tripDetails: TripDetails;
}
export async function loader({ params }: Route.LoaderArgs) {
    const tripDetails = TRIPS.find(t => String(t.id) === params.tripId);

    if (!tripDetails) {
        return json({ message: '404 Not Found' }, { status: 404 });
    }

    return json<LoaderData>({ tripDetails });
};

export default function TripDetailsPage() {
    const { tripDetails } = useLoaderData<LoaderData>();

    return (
        <div className='centered-max-width-960 tdp-container'>
            <h1 className='tdp-container__title'>{tripDetails.title}</h1>
            <p className='tdp-container__subtitle'>{tripDetails.subtitle}</p>
            <NavLink to='/' aria-label='Back to Home Page' viewTransition>Back</NavLink>
            <NavLink to={`/trips/${tripDetails.id + 1}`} aria-label='Next Trip'>Next Trip</NavLink>
        </div>
    );
};

// See issue: https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/37
export function ErrorBoundary() {
    return (
        <p>404 NOT FOUND</p>
    );
}
