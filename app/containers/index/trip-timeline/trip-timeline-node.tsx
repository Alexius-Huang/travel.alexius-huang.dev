import type { FC } from "react";
import { ImageCarousel } from "./image-carousel";
import './trip-timeline-node.css';

export const TripTimelineNode: FC = () => {
    return (
        <div
            className='trip-timeline-node'
        >
            <div>
                Random Highlights
            </div>

            <ImageCarousel className="my-6 pb-2" />

            <div>
                Title / Description
                <span aria-hidden='true' className='timeline-dot' />
            </div>

            <div className='timeline-bar' />
        </div>
    );
};
