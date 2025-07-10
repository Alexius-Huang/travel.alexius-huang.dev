import { useRef, type FC } from 'react';
import { LocationsSwimlane } from './locations-swimlane';
import { AttractionsCarousel } from './attractions-carousel';
import { useIsMouseEntering } from '~/hooks/use-is-mouse-entering';
import { TripIntroduction } from './trip-introduction';
import type { TripDetails } from '~/data-access/trips';
import './trip-timeline-node.css';

export interface TripTimelineNodeProps {
    tripDetails: TripDetails;
}

export const TripTimelineNode: FC<TripTimelineNodeProps> = ({
    tripDetails,
}) => {
    const timelineNodeRef = useRef<HTMLDivElement>(null);
    const isMouseEnteringTimelineNode = useIsMouseEntering(timelineNodeRef);

    return (
        <div className="trip-timeline-node" ref={timelineNodeRef}>
            {/* Attraction Highlights */}
            <AttractionsCarousel
                autoplay={isMouseEnteringTimelineNode}
                className='hidden md:block'
                attractions={[
                    {
                        url: 'https://placehold.co/200x200?text=Photo+1',
                        description:
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                        name: 'Attraction 1',
                        location: {
                            name: 'New York City, New York, USA',
                            countryCode: 'us',
                        },
                    },
                    {
                        url: 'https://placehold.co/200x200?text=Photo+2',
                        name: 'Attraction 2',
                        location: {
                            name: 'New York City, New York, USA',
                            countryCode: 'us',
                        },
                    },
                    {
                        url: 'https://placehold.co/200x200?text=Photo+3',
                        name: 'Attraction 3',
                        description:
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    },
                    {
                        url: 'https://placehold.co/200x200?text=Photo+4',
                        name: 'Attraction 4',
                    },
                ]}
            />

            {/* Travelled Cities Gallery Swimlane */}
            <LocationsSwimlane
                className="mb-8"
                width={150}
                height={200}
                locations={[
                    {
                        url: 'https://placehold.co/200x200?text=City+1',
                        name: 'New York City',
                        countryCode: 'us',
                    },
                    {
                        url: 'https://placehold.co/200x200?text=City+2',
                        name: 'Philadelphia',
                        countryCode: 'us',
                    },
                    {
                        url: 'https://placehold.co/200x200?text=City+3',
                        name: 'Washington D.C.',
                        countryCode: 'us',
                    },
                ]}
            />

            <TripIntroduction {...tripDetails} />

            <div className="timeline-bar" />
        </div>
    );
};
