import { useRef, type FC } from 'react';
import { LocationsSwimlane } from './locations-swimlane';
import { Button } from '~/components/button';
import { TagList } from './tag-list';
import { CountryFlagChip } from '~/ui/country-flag-chip';
import { AttractionsCarousel } from './attractions-carousel';
import { useIsMouseEntering } from '~/hooks/use-is-mouse-entering';
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
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                        location: {
                            name: 'New York City, New York, USA',
                            countryCode: 'us',
                        }
                    },
                    {
                        url: 'https://placehold.co/200x200?text=Photo+2',
                        location: {
                            name: 'New York City, New York, USA',
                            countryCode: 'us',
                        }
                    },
                    {
                        url: 'https://placehold.co/200x200?text=Photo+3',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
                    },
                    {
                        url: 'https://placehold.co/200x200?text=Photo+4',
                    }
                ]}
            />

            {/* Travelled Cities Gallery Swimlane */}
            <LocationsSwimlane
                className='mb-8'
                width={150}
                height={200}
                locations={[
                    {
                        url: 'https://placehold.co/200x200?text=City+1',
                        name: 'New York City',
                        countryCode: 'us'
                    },
                    {
                        url: 'https://placehold.co/200x200?text=City+2',
                        name: 'Philadelphia',
                        countryCode: 'us'
                    },
                    {
                        url: 'https://placehold.co/200x200?text=City+3',
                        name: 'Washington D.C.',
                        countryCode: 'us'
                    }
                ]}
            />

            <article className='relative flex flex-col gap-y-2'>
                <h3 className='text-2xl font-bold uppercase text-blue-500 dark:text-blue-400'>
                    Trip Title
                </h3>
                <p className='text-lg font-normal tracking-wide text-gray-600 dark:text-gray-300'>
                    This is the trip's subtitle
                </p>

                <div className='flex flex-row flex-wrap gap-x-2 gap-y-1.5 mb-1'>
                    <CountryFlagChip
                        countryCode='us'
                        name='United States'
                        variant='horizontal'
                        className='direction-ltr'
                    />
                    <CountryFlagChip
                        countryCode='gb'
                        name='United Kingdom'
                        variant='horizontal'
                        className='direction-ltr'
                    />
                </div>

                <TagList
                    tags={['Tag A', 'Tag B', 'Tag C']}
                />

                <p className='text-md tracking-wide text-balance font-light my-4 line-clamp-3'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <div>
                    <Button size='sm'>Explore</Button>
                </div>

                <span aria-hidden="true" className="timeline-dot" />
            </article>

            <div className="timeline-bar" />
        </div>
    );
};
