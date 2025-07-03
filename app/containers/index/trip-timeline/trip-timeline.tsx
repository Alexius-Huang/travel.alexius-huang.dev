import type { FC } from "react";
import { trim } from "~/utils/trim";
import { Button } from "~/components/button";
import { TripTimelineNode } from "./trip-timeline-node";

interface TripTimelineProps {
    className?: string;
}

/**
 *  Shows latest 3 major trips (or minor trips and is able to expand to travel-timeline page) 
 *  Checkout issue: https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/24
 */
export const TripTimeline: FC<TripTimelineProps> = ({ className }) => {
    return (
        <section className={className}>
            <h2 className={trim`
                text-center text-3xl font-bold uppercase
                text-blue-500
            `}>My Journey Timeline</h2>

            <div aria-hidden='true' className='text-center mt-[1rem]'>
                <span className='font-bold text-xl'>{new Date().getFullYear()}</span>
            </div>

            <div className='relative pt-8'>
                <span className='absolute rounded inline-block w-8 h-8 left-0 right-0 top-0 mx-auto bg-blue-500' aria-hidden='true' />

                <TripTimelineNode />
                <TripTimelineNode />
                <TripTimelineNode />

                <div className='flex flex-col items-center relative pt-15'>
                    <span
                        aria-hidden='true'
                        className={trim`
                            absolute left-0 right-0 top-0 mx-auto
                            inline-block w-1.25 h-12 bg-gradient-to-b from-blue-500 to-transparent
                        `}
                    />

                    <Button variant='primary'>Checkour More (Under Construction 🚧)</Button>
                </div>
            </div>
        </section>
    );
}
