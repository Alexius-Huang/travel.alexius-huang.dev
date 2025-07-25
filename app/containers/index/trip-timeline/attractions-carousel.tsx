import { useState, type FC } from 'react';
import { CountryFlagIcon } from '~/icons/country/country';
import { MapPinOutlineIcon } from '~/icons/outline/map-pin';
import { trim } from '~/utils/trim';
import { Button } from '~/components/button';
import {
    ImageCarousel,
    type ImageCarouselProps,
} from '~/components/image-carousel';

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
    autoplay?: ImageCarouselProps['autoplay'];
    autoplayDuration?: ImageCarouselProps['autoplayDuration'];
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
            imageClassName="aspect-3/4 lg:aspect-4/3"
            images={attractions}
            autoplay={autoplay}
            autoplayDuration={autoplayDuration}
            onImageFocus={(_, index) => setFocusAttractionIndex(index)}
        >
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
        </ImageCarousel>
    );
};
