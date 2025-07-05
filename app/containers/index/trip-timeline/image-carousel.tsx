import { useEffect, useRef, useState, type FC } from "react";
import { CountryFlagIcon } from "~/icons/country/country";
import { ChevronLeftOutlineIcon } from "~/icons/outline/chevron-left";
import { ChevronRightOutlineIcon } from "~/icons/outline/chevron-right";
import { MapPinOutlineIcon } from "~/icons/outline/map-pin";
import { trim } from "~/utils/trim";
import { useIsMouseEntering } from "~/hooks/use-is-mouse-entering";
import './image-carousel.css';

export interface ImageCarouselProps {
    className?: string;
    images: Array<{
        url: string;
        description?: string;
        location?: {
            name: string;
            countryCode: string;
        };
    }>;
    autoplay?: boolean;
    autoplayDuration?: number;
}

let timeoutSignature: ReturnType<typeof setTimeout> | undefined;

export const ImageCarousel: FC<ImageCarouselProps> = ({
    className,
    images,
    autoplay,
    autoplayDuration = 5000
}) => {
    const [focusImgIndex, setFocusImgIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isEnteringImageCarousel = useIsMouseEntering(containerRef);

    const {
        description,
        location
    } = images[focusImgIndex];

    const translation = `translateX(calc(-${100 * focusImgIndex}%))`;

    const switchImageTo = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && focusImgIndex !== 0) {
            setFocusImgIndex(state => state - 1);
        } else if (direction === 'next' && focusImgIndex !== images.length - 1) {
            setFocusImgIndex(state => state + 1);
        } else {
            console.warn(`Unable to switch to "${direction}" image`);
        }
    };

    const disablePrevBtn = focusImgIndex === 0;
    const disableNextBtn = focusImgIndex === images.length - 1;

    const scheduleAutoplay = () => setTimeout(() => {
        if (focusImgIndex === images.length - 1) {
            setFocusImgIndex(0);
        } else {
            setFocusImgIndex(i => i + 1);
        }
    }, autoplayDuration);

    /**
     *  We autoplay the image carousel only when mouse is NOT focusing
     *  the image carousel component but is marked as autoplay: true 
     */
    const shouldAutoplay = autoplay && !isEnteringImageCarousel;
    useEffect(() => {
        clearTimeout(timeoutSignature);

        if (shouldAutoplay) {
            console.log('scheduling')
            timeoutSignature = scheduleAutoplay();
        } else {
            console.log('cleared')
            clearTimeout(timeoutSignature);
        }
    }, [shouldAutoplay, autoplayDuration, scheduleAutoplay]);

    return (
        <div ref={containerRef} className={`relative w-full h-full px-[1.5rem] ${className}`}>
            <div
                className='relative w-full h-[75%] overflow-hidden text-[0px]'
            >
                <div className='inline-flex flex-nowrap w-full h-full direction-ltr transition-transform duration-300 ease-in-out'
                    style={{ transform: translation }}
                >
                    {images.map(({ url }, i) => (
                        <div
                            key={i}
                            style={{ backgroundImage: `url(${url})` }}
                            className='flex-[0_0_auto] w-full h-full bg-center bg-cover bg-no-repeat z-1'
                        />
                    ))}
                </div>

                <div className={trim`
                    absolute w-full h-[50px]
                    left-0 bottom-0 z-1
                    bg-gradient-to-t from-white dark:from-gray-900
                    to-transparent
                `} />

                <div className={trim`
                    w-full h-[35px]
                    absolute bottom-0 left-0 z-2
                    flex items-center justify-center gap-x-1.5
                    direction-ltr
                `}>
                    {images.map((_, i) => (
                        <span key={i} className={trim`
                            inline-block rounded-md
                            transition-all duration-250 ease-in-out
                            ${i === focusImgIndex
                                ? 'bg-blue-500 dark:bg-yellow-300 w-2.5 h-2.5'
                                : 'bg-blue-500/60 dark:bg-yellow-300/60 w-1.5 h-1.5'
                            }
                        `} />
                    ))}
                </div>
            </div>

            <div className='w-full px-2 py-3 direction-ltr'>
                {location ? (
                    <p className='flex flex-row gap-x-1 text-xs items-center'>
                        <CountryFlagIcon className='rounded mr-1' countryCode={location.countryCode} size='sm' />
                        <span>{location.name}</span>                        
                    </p>
                ) : (
                    <p className='flex flex-row gap-x-1 text-xs items-center text-gray-500 dark:text-gray-400'>
                        <MapPinOutlineIcon size='sm' />
                        <span>Unknown Location</span>
                    </p>
                )}
                <p className={trim`
                    text-sm tracking-wide text-balance font-light my-4 line-clamp-3
                    ${description ? '' : 'text-xs text-gray-500 dark:text-gray-400'}
                `}>
                    {description ?? 'No Description Provided'}
                </p>
            </div>

            {/* This is a hidden button to let image left side entire area to be clickable */}
            <div
                role='button'
                aria-hidden='true'
                className={trim`
                    image-carousel__hidden-btn
                    direction-ltr left-0
                `}
                onClick={() => !disablePrevBtn && switchImageTo('prev')}
            />
            <button className={trim`
                direction-ltr text-left left-0
            `}
                disabled={disablePrevBtn}
                onClick={() => switchImageTo('prev')}
            >
                <span className='rounded-l-sm'>
                    <ChevronLeftOutlineIcon size='sm' className='inline-block' />
                </span>
            </button>

            {/* This is a hidden button to let image right side entire area to be clickable */}
            <div
                role='button'
                aria-hidden='true'
                className={trim`
                    image-carousel__hidden-btn
                    direction-ltr right-0
                `}
                onClick={() => !disableNextBtn && switchImageTo('next')}
            />
            <button className={trim`
                direction-ltr text-right right-0
            `}
                disabled={disableNextBtn}
                onClick={() => switchImageTo('next')}
            >
                <span className='rounded-r-sm'>
                    <ChevronRightOutlineIcon size='sm' className='inline-block' />
                </span>
            </button>
        </div>
    )
};
