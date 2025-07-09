import { useState, type FC } from 'react';
import { CountryFlagIcon } from '~/icons/country/country';
import { MapPinOutlineIcon } from '~/icons/outline/map-pin';
import { trim } from '~/utils/trim';
import { Button } from '~/components/button';
import { ImageCarousel } from '~/components/image-carousel';

export interface AttractionsCarouselProps {
    className?: string;
    attractions: Array<{
        url: string;
        description?: string;
        name: string;
        location?: {
            name: string;
            countryCode: string;
        };
    }>;
    autoplay?: boolean;
    autoplayDuration?: number;
}

export const AttractionsCarousel: FC<AttractionsCarouselProps> = ({
    className,
    attractions,
    autoplay,
    autoplayDuration,
}) => {
    const [focusAttractionIndex, setFocusAttractionIndex] = useState(0);
    const { description, location } = attractions[focusAttractionIndex];

    return (
        <ImageCarousel
            className={className}
            width={600}
            height={300}
            images={attractions}
            autoplay={autoplay}
            autoplayDuration={autoplayDuration}
            onImageFocus={(_, index) => setFocusAttractionIndex(index)}
        >
            <div className="w-full px-2 py-3 direction-ltr">
                {location ? (
                    <p className="flex flex-row gap-x-1 text-xs items-center">
                        <CountryFlagIcon
                            className="rounded mr-1"
                            countryCode={location.countryCode}
                            size="sm"
                        />
                        <span>{location.name}</span>
                    </p>
                ) : (
                    <p className="flex flex-row gap-x-1 text-xs items-center text-gray-500 dark:text-gray-400">
                        <MapPinOutlineIcon size="sm" />
                        <span>Unknown Location</span>
                    </p>
                )}
                <p
                    className={trim`
                    text-sm tracking-wide font-light my-4 line-clamp-3
                    ${description ? '' : 'text-xs text-gray-500 dark:text-gray-400'}
                `}
                >
                    {description ?? 'No Description Provided'}
                </p>

                <div>
                    <Button
                        size="xs"
                        variant="secondary"
                        className="!border-1"
                        aria-label={`View the details of ${attractions[focusAttractionIndex].name}`}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </ImageCarousel>
    );
};
