import { useEffect, useState, type FC } from "react";
import { CountryFlagIcon } from "~/icons/country/country";
import { ChevronLeftOutlineIcon } from "~/icons/outline/chevron-left";
import { ChevronRightOutlineIcon } from "~/icons/outline/chevron-right";
import { MapPinOutlineIcon } from "~/icons/outline/map-pin";
import { trim } from "~/utils/trim";

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
}

export const ImageCarousel: FC<ImageCarouselProps> = ({
    className,
    images
}) => {
    const [focusImgIndex, setFocusImgIndex] = useState(0);

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
    }

    return (
        <div className={`relative w-full h-full px-[1.5rem] ${className}`}>
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
                        <span className={trim`
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

            <button className={trim`
                direction-ltr text-left
                absolute left-0 top-0 w-[50%] h-[75%] z-3
                hover:text-blue-500
            `}
                onClick={() => switchImageTo('prev')}
            >
                <span className='bg-gray-100 dark:bg-blue-500/30 rounded-l-sm px-0.5 py-4 inline-flex items-center'>
                    <ChevronLeftOutlineIcon size='sm' className='inline-block' />
                </span>
            </button>

            <button className={trim`
                direction-ltr text-right
                absolute right-0 top-0 w-[50%] h-[75%] z-3
                hover:text-blue-500
            `}
                onClick={() => switchImageTo('next')}
            >
                <span className='bg-gray-100 dark:bg-blue-500/30 rounded-r-sm px-0.5 py-4 inline-flex items-center'>
                    <ChevronRightOutlineIcon size='sm' className='inline-block' />
                </span>
            </button>
        </div>
    )
};
