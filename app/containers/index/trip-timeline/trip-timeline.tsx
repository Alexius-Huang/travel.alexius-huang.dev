import type { FC } from 'react';
import { trim } from '~/utils/trim';
import { Button } from '~/components/button';
import { TripTimelineNode } from './trip-timeline-node';
import { useLoaderData } from 'react-router';
import type { HomePageLoaderData } from '~/routes/index';

interface TripTimelineProps {
    className?: string;
}

/**
 *  Shows latest 3 major trips (or minor trips and is able to expand to travel-timeline page)
 *  Checkout issue: https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/24
 */
export const TripTimeline: FC<TripTimelineProps> = ({ className }) => {
    const { trips } = useLoaderData<HomePageLoaderData>();

    return (
        <section className={className}>
            <h2
                className={trim`
                text-center text-3xl font-bold uppercase
                text-blue-500 mb-[2rem] xs:mb-[3rem]
            `}
            >
                My Journey Timeline
            </h2>

            <div
                aria-hidden="true"
                className="hidden md:block text-center mb-[1rem]"
            >
                <span className="font-bold font-header text-2xl">
                    {new Date().getFullYear()}
                </span>
            </div>

            <div className="relative pt-8">
                <span
                    className={trim`
                        rounded inline-block 
                        absolute w-8 h-8 left-[-.875rem] md:left-0 md:right-0 top-0 mx-auto bg-blue-500
                    `}
                    aria-hidden="true"
                >
                    <span className="md:hidden absolute left-[calc(100%+1rem)] h-full flex items-center">
                        <span className="font-bold font-header text-xl tracking-wider">
                            {new Date().getFullYear()}
                        </span>
                    </span>
                </span>

                {trips.map((trip) => (
                    <TripTimelineNode key={trip.id} tripDetails={trip} />
                ))}

                <div className="flex flex-col items-center relative pt-15">
                    <span
                        aria-hidden="true"
                        className={trim`
                            absolute left-0 md:right-0 top-0 mx-auto
                            inline-block w-1.25 h-12 bg-gradient-to-b from-blue-500 to-transparent
                        `}
                    />

                    <Button variant="primary">
                        Checkour More (Under Construction 🚧)
                    </Button>
                </div>
            </div>
        </section>
    );
};
