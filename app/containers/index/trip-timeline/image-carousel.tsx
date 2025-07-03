import type { FC } from 'react';
import { trim } from '~/utils/trim';

const images = Array.from(
    { length: 5 },
    (_, i) => `https://placehold.co/200x200?text=Image+${i + 1}`,
);

interface ImageCarouselProps {
    className?: string;
}

export const ImageCarousel: FC<ImageCarouselProps> = ({ className }) => {
    return (
        <div className={trim`
            ${className} overflow-x-auto whitespace-nowrap
            scrollbar scrollbar-h-1
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
                            `}
                            style={{ backgroundImage: `url(${src})` }}
                            role="img"
                            aria-label={`Placeholder Image ${index + 1}`}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
