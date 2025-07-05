import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import { trim } from '~/utils/trim';
import { throttle } from '~/utils/throttle';

const images = Array.from(
    { length: 5 },
    (_, i) => `https://placehold.co/200x200?text=Image+${i + 1}`,
);

interface ImageCarouselProps {
    className?: string;
}

export const ImageCarousel: FC<ImageCarouselProps> = ({ className }) => {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const [hydrated, setHydrated] = useState(false);

    const handleScroll = useCallback(throttle(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const direction = window.getComputedStyle(carousel).direction as 'rtl' | 'ltr';
        const { scrollWidth, clientWidth } = carousel;

        /**
         *  The reason why we apply absolute value is because if
         *  the image carousel is in writing mode "rtl", the scrollLeft
         *  will become negative value 
         */
        const scrollLeft = Math.abs(carousel.scrollLeft);
        const scrollableWidth = scrollWidth - clientWidth;
        const percentage = scrollLeft / scrollableWidth;

        setScrollPercentage(direction === 'ltr' ? percentage : 1 - percentage);
    }, 100), []);

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
        }
    }, [handleScroll, hydrated]);

    const leftGradientOpacity = scrollPercentage > .2 ? 1 : 1 - ((.2 - scrollPercentage) * 5);
    const rightGradientOpacity = scrollPercentage < .8 ? 1 : 1 - ((scrollPercentage - .8) * 5);

    return (
        <div className={`${className} relative w-full overflow-x-auto`}>
            <div
                ref={el => {
                    if (!el) return;
                    carouselRef.current = el;
                }}
                className={trim`
                    w-full overflow-x-auto whitespace-nowrap
                    scrollbar scrollbar-h-1 pb-2
                `}
            >
                <ul className="inline-flex gap-[1rem]">
                    {images.map((src, index) => (
                        /**
                         *  flex: 0 0 auto means:
                         *  - flex-shrink: 0
                         *  - flex-grow: 0
                         *  - flex-basis: auto
                         *  Don’t grow or shrink -- stay exactly the size based on content or set dimensions
                         **/
                        <li key={index} className="flex-[0_0_auto]">
                            <div
                                className={trim`
                                    w-[150px] h-[150px]
                                    rounded bg-cover bg-center bg-no-repeat
                                    shadow-md shadow-gray-500 dark:shadow-blue-500
                                `}
                                style={{ backgroundImage: `url(${src})` }}
                                role="img"
                                aria-label={`Placeholder Image ${index + 1}`}
                            />
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
