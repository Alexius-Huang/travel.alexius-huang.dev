import { useRef, type FC } from 'react';
import { LocationsSwimlane } from './locations-swimlane';
import { AttractionsCarousel } from './attractions-carousel';
import { useIsMouseEntering } from '~/hooks/use-is-mouse-entering';
import { TripIntroduction } from './trip-introduction';
import './trip-timeline-node.css';

export const TripTimelineNode: FC = () => {
    const timelineNodeRef = useRef<HTMLDivElement>(null);
    const isMouseEnteringTimelineNode = useIsMouseEntering(timelineNodeRef);

    return (
        <div className="trip-timeline-node" ref={timelineNodeRef}>
            {/* Attraction Highlights */}
            <AttractionsCarousel
                autoplay={isMouseEnteringTimelineNode}
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

            <TripIntroduction
                title="USA East Coast Capital Tour"
                subtitle="Wandering Through the Financial & Political Center of USA"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                tags={['Tag A', 'Tag B', 'Tag C']}
                countryCodes={['us', 'gb']}
                date={{ from: '2025-04-30', to: '2025-05-12' }}
            />

            <div className="timeline-bar" />
        </div>
    );
};
