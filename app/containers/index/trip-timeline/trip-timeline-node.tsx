import type { FC } from "react";
import './trip-timeline-node.css';

export const TripTimelineNode: FC = () => {
    return (
        <div
            className='trip-timeline-node'
        >
            <div>
                Random Highlights
            </div>

            <div>
                Image Carousel
            </div>

            <div>
                Title / Description
                <span aria-hidden='true' className='timeline-dot' />
            </div>

            <div className='timeline-bar' />
        </div>
    );
};
