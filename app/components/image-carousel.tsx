import { useEffect, useRef, useState, type FC, type PropsWithChildren } from "react";
import { useIsMouseEntering } from "~/hooks/use-is-mouse-entering";
import { ChevronLeftOutlineIcon } from "~/icons/outline/chevron-left";
import { ChevronRightOutlineIcon } from "~/icons/outline/chevron-right";
import { trim } from "~/utils/trim";
import './image-carousel.css';

interface ImageCarouselProps {
    className?: string;
    width: number;
    height: number;
    images: Array<{ url: string }>;
    autoplay?: boolean;
    autoplayDuration?: number;
    onImageFocus?: (image: { url: string }, index: number) => void;
}

export const ImageCarousel: FC<PropsWithChildren<ImageCarouselProps>> = ({
    className,
    width,
    height,
    images,
    children,
    autoplay,
    autoplayDuration = 5000,
    onImageFocus
}) => {
    const [focusImgIndex, setFocusImgIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isEnteringImageCarousel = useIsMouseEntering(containerRef);
    const timeoutSignature = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const translation = `translateX(calc(-${100 * focusImgIndex}%))`;

    const switchImageTo = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && focusImgIndex !== 0) {
            setFocusImgIndex((state) => state - 1);
        } else if (
            direction === 'next' &&
            focusImgIndex !== images.length - 1
        ) {
            setFocusImgIndex((state) => state + 1);
        } else {
            console.warn(`Unable to switch to "${direction}" image`);
        }
    };

    const disablePrevBtn = focusImgIndex === 0;
    const disableNextBtn = focusImgIndex === images.length - 1;

    const scheduleAutoplay = () =>
        setTimeout(() => {
            if (focusImgIndex === images.length - 1) {
                setFocusImgIndex(0);
            } else {
                setFocusImgIndex((i) => i + 1);
            }
        }, autoplayDuration);

    /**
     *  We autoplay the image carousel only when mouse is NOT focusing
     *  the image carousel component but is marked as autoplay: true
     */
    const shouldAutoplay = autoplay && !isEnteringImageCarousel;
    useEffect(() => {
        if (shouldAutoplay) {
            timeoutSignature.current = scheduleAutoplay();
        } else {
            clearTimeout(timeoutSignature.current);
        }

        return () => {
            clearTimeout(timeoutSignature.current);
        };
    }, [shouldAutoplay, autoplayDuration, scheduleAutoplay]);

    useEffect(() => {
        onImageFocus?.(images[focusImgIndex], focusImgIndex);
    }, [onImageFocus, images, focusImgIndex]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full px-[1.5rem] ${className}`}
        >

            <div className="relative w-full h-[75%] overflow-hidden text-[0px]">
                <div
                    className="inline-flex flex-nowrap w-full h-full direction-ltr transition-transform duration-300 ease-in-out"
                    style={{ transform: translation }}
                >
                    {images.map(({ url }, i) => (
                        <div
                            key={i}
                            style={{ backgroundImage: `url(${url})` }}
                            className="flex-[0_0_auto] w-full h-full bg-center bg-cover bg-no-repeat z-1"
                        />
                    ))}
                </div>

                <div
                    className={trim`
                    absolute w-full h-[50px]
                    left-0 bottom-0 z-1
                    bg-gradient-to-t from-white dark:from-gray-900
                    to-transparent
                `}
                />

                <div
                    className={trim`
                    w-full h-[35px]
                    absolute bottom-0 left-0 z-2
                    flex items-center justify-center gap-x-1.5
                    direction-ltr
                `}
                >
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={trim`
                            inline-block rounded-md
                            transition-all duration-250 ease-in-out
                            ${
                                i === focusImgIndex
                                    ? 'bg-blue-500 dark:bg-yellow-300 w-2.5 h-2.5'
                                    : 'bg-blue-500/60 dark:bg-yellow-300/60 w-1.5 h-1.5'
                            }
                        `}
                        />
                    ))}
                </div>
            </div>

            {children}

            {/* This is a hidden button to let image left side entire area to be clickable */}
            <div
                role="button"
                aria-hidden="true"
                className={trim`
                    image-carousel__hidden-btn
                    direction-ltr left-0
                `}
                onClick={() => !disablePrevBtn && switchImageTo('prev')}
            />
            <button
                className={trim`
                direction-ltr text-left left-0
            `}
                disabled={disablePrevBtn}
                onClick={() => switchImageTo('prev')}
            >
                <span className="rounded-l-sm">
                    <ChevronLeftOutlineIcon
                        size="sm"
                        className="inline-block"
                    />
                </span>
            </button>

            {/* This is a hidden button to let image right side entire area to be clickable */}
            <div
                role="button"
                aria-hidden="true"
                className={trim`
                    image-carousel__hidden-btn
                    direction-ltr right-0
                `}
                onClick={() => !disableNextBtn && switchImageTo('next')}
            />
            <button
                className={trim`
                direction-ltr text-right right-0
            `}
                disabled={disableNextBtn}
                onClick={() => switchImageTo('next')}
            >
                <span className="rounded-r-sm">
                    <ChevronRightOutlineIcon
                        size="sm"
                        className="inline-block"
                    />
                </span>
            </button>
        </div>
    );
};
