import { useEffect, useRef, useState, type FC } from 'react';
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
    const [showLeftGradient, setShowLeftGradient] = useState(false);
    const [showRightGradient, setShowRightGradient] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const handleScroll = throttle(() => {
            const { scrollLeft, scrollWidth, clientWidth } = carousel;
            setShowLeftGradient(scrollLeft > 0);
            setShowRightGradient(scrollLeft < scrollWidth - clientWidth);
        }, 100);

        carousel.addEventListener('scroll', handleScroll);
        return () => carousel.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`${className} relative w-full overflow-x-auto`}>
        <div
            ref={carouselRef}
            className={trim`
            w-full overflow-x-auto whitespace-nowrap
            scrollbar scrollbar-h-1 pb-2
        `}>
            <ul className='inline-flex gap-[1rem]'>
                {images.map((src, index) => (
                    /**
                     *  flex: 0 0 auto means:
                     *  - flex-shrink: 0
                     *  - flex-grow: 0
                     *  - flex-basis: auto
                     *  Don’t grow or shrink -- stay exactly the size based on content or set dimensions
                     **/
                    <li key={index} className='flex-[0_0_auto]'>
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

        <div className={trim`
            absolute top-0 left-0 pointer-events-none h-full w-6
            ${showLeftGradient ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ease-in-out
            bg-gradient-to-r from-white dark:from-gray-900 to-transparent
        `} />

        <div className={trim`
            absolute top-0 right-0 pointer-events-none h-full w-6
            ${showRightGradient ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ease-in-out
            bg-gradient-to-l from-white dark:from-gray-900 to-transparent
        `} />
        </div>
    );
};
