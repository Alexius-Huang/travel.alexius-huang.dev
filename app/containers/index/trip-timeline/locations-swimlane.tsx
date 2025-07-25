import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import { trim } from '~/utils/trim';
import { throttle } from '~/utils/throttle';
import type { TripDetails } from '~/data-access/trips';
import { Link } from 'react-router';

interface LocationsSwimlaneProps {
    className?: string;
    width: string | number;
    height: string | number;
    locations: TripDetails['locations'];
}

export const LocationsSwimlane: FC<LocationsSwimlaneProps> = ({
    className,
    width,
    height,
    locations,
}) => {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const [hydrated, setHydrated] = useState(false);

    const handleScroll = useCallback(
        throttle(() => {
            const carousel = carouselRef.current;
            if (!carousel) return;

            const direction = window.getComputedStyle(carousel).direction as
                | 'rtl'
                | 'ltr';
            const { scrollWidth, clientWidth } = carousel;

            /**
             *  The reason why we apply absolute value is because if
             *  the image carousel is in writing mode "rtl", the scrollLeft
             *  will become negative value
             */
            const scrollLeft = Math.abs(carousel.scrollLeft);
            const scrollableWidth = scrollWidth - clientWidth;
            const percentage =
                scrollableWidth === 0 ? 0 : scrollLeft / scrollableWidth;

            setScrollPercentage(
                direction === 'ltr' ? percentage : 1 - percentage,
            );
        }, 100),
        [],
    );

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        if (!hydrated) {
            handleScroll();
            setHydrated(true);
        }

        carousel.addEventListener('scroll', handleScroll);
        return () => {
            carousel.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll, hydrated]);

    const leftGradientOpacity =
        scrollPercentage > 0.2 ? 1 : 1 - (0.2 - scrollPercentage) * 5;
    const rightGradientOpacity =
        scrollPercentage < 0.8 ? 1 : 1 - (scrollPercentage - 0.8) * 5;

    width = typeof width === 'number' ? `${width}px` : width;
    height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div className={`${className} relative w-full overflow-x-auto`}>
            <div
                ref={(el) => {
                    if (!el) return;
                    carouselRef.current = el;
                }}
                className={trim`
                    w-full overflow-x-auto whitespace-nowrap
                    scrollbar scrollbar-h-1 pb-2
                `}
            >
                <ul className="inline-flex gap-[1rem] px-3 py-4">
                    {locations.map(({ name, nameId }) => (
                        /**
                         *  flex: 0 0 auto means:
                         *  - flex-shrink: 0
                         *  - flex-grow: 0
                         *  - flex-basis: auto
                         *  Don’t grow or shrink -- stay exactly the size based on content or set dimensions
                         **/
                        <li key={name} className="flex-[0_0_auto]">
                            <div
                                className={trim`
                                    relative rounded
                                    bg-cover bg-center bg-no-repeat
                                    shadow-sm shadow-gray-400 dark:shadow-blue-500
                                    transition-all duration-200 hover:scale-105
                                    hover:shadow-md hover:shadow-gray-300 hover:dark:shadow-blue-500/50
                                    cursor-pointer
                                `}
                                style={{
                                    /**
                                     *  TODO: Use the real image data
                                     */
                                    backgroundImage: `url(https://placehold.co/200x200?text=${name.split(' ').join('-')})`,
                                    width,
                                    height,
                                }}
                                role="img"
                                aria-label={`Image of ${name}`}
                            >
                                <p
                                    className={trim`
                                    absolute bottom-0 left-0 px-2 pt-6 pb-1 w-full
                                    text-sm whitespace-normal line-clamp-2
                                    text-gray-700 dark:text-white tracking-wide font-light
                                    bg-gradient-to-t from-yellow-300 dark:from-blue-500 to-transparent
                                `}
                                >
                                    {name}
                                </p>

                                <Link
                                    aria-label={`View more details about ${name}`}
                                    className={trim`
                                        absolute inline-block w-full h-full left-0 top-0 rounded
                                        focus:ring-4 focus:ring-offset-4 focus:ring-blue-500
                                        focus:ring-offset-white dark:focus:ring-offset-gray-900
                                    `}
                                    to={`/location/${nameId}`}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div
                className={trim`
                    absolute top-0 left-0 pointer-events-none h-full w-6
                    bg-gradient-to-r from-white dark:from-gray-900 to-transparent
                `}
                style={{ opacity: leftGradientOpacity }}
            />

            <div
                className={trim`
                    absolute top-0 right-0 pointer-events-none h-full w-6
                    bg-gradient-to-l from-white dark:from-gray-900 to-transparent
                `}
                style={{ opacity: rightGradientOpacity }}
            />
        </div>
    );
};
