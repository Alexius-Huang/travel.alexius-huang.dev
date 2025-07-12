import {
    useEffect,
    useRef,
    useState,
    type FC,
    type PropsWithChildren,
} from 'react';
import { useIsMouseEntering } from '~/hooks/use-is-mouse-entering';
import { ChevronLeftOutlineIcon } from '~/icons/outline/chevron-left';
import { ChevronRightOutlineIcon } from '~/icons/outline/chevron-right';
import { trim } from '~/utils/trim';
import './image-carousel.css';

export interface ImageCarouselProps {
    /**
     *  Required to have class to represent aspect-ratio: aspect-*
     */
    imageClassName: string;

    className?: string;
    images: Array<{ url: string }>;
    autoplay?: boolean;
    autoplayDuration?: number;
    onImageFocus?: (image: { url: string }, index: number) => void;
}

export const ImageCarousel: FC<PropsWithChildren<ImageCarouselProps>> = ({
    className,
    imageClassName,
    images,
    children,
    autoplay,
    autoplayDuration = 5000,
    onImageFocus,
}) => {
    const [focusImgIndex, setFocusImgIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isEnteringImageCarousel = useIsMouseEntering(containerRef);
    const timeoutSignature = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );

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
            className={`block relative px-[1.5rem] ${className}`}
        >
            <div className="relative w-full">
                <div className="relative w-full overflow-hidden text-[0px]">
                    <div className="image-carousel__carousel">
                        {images.map(({ url }) => (
                            <img
                                key={url}
                                src={url}
                                alt="Some text"
                                className={imageClassName}
                                style={{ transform: translation }}
                            />
                        ))}
                    </div>

                    <span
                        aria-hidden="true"
                        className="image-carousel__image-gradient"
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

                {/* This is a hidden button to let image left side entire area to be clickable */}
                <div
                    role="button"
                    aria-hidden="true"
                    className="image-carousel__hidden-btn"
                    onClick={() => !disablePrevBtn && switchImageTo('prev')}
                />
                <button
                    disabled={disablePrevBtn}
                    onClick={() => switchImageTo('prev')}
                >
                    <span>
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
                    className="image-carousel__hidden-btn"
                    onClick={() => !disableNextBtn && switchImageTo('next')}
                />
                <button
                    disabled={disableNextBtn}
                    onClick={() => switchImageTo('next')}
                >
                    <span>
                        <ChevronRightOutlineIcon
                            size="sm"
                            className="inline-block"
                        />
                    </span>
                </button>
            </div>

            <div className="w-full px-2 py-3 direction-ltr">{children}</div>
        </div>
    );
};
