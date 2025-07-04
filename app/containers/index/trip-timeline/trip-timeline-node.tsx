import type { FC } from 'react';
import { ImageCarousel } from './image-carousel';
import { Button } from '~/components/button';
import { TagList } from './tag-list';
import './trip-timeline-node.css';

export const TripTimelineNode: FC = () => {
    return (
        <div className="trip-timeline-node">
            <div>Random Highlights</div>

            <ImageCarousel className="my-6" />

            <article className='relative flex flex-col gap-y-2'>
                <h3 className='text-xl font-bold uppercase'>
                    Trip Title
                </h3>

                <TagList
                    tags={['Tag A', 'Tag B', 'Tag C']}
                />

                <p className='text-md tracking-wide text-balance font-light my-4 line-clamp-3'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <div>
                    <Button size='sm'>
                        View Details
                    </Button>
                </div>

                <span aria-hidden="true" className="timeline-dot" />
            </article>

            <div className="timeline-bar" />
        </div>
    );
};
