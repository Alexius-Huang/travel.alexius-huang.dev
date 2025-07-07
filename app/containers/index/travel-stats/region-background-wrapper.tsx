import type { FC, PropsWithChildren } from 'react';
import { IMG_BASE_URL } from '~/data-access/image-service';
import { trim } from '~/utils/trim';

export interface RegionBackgroundWrapperProps {
    className?: string;
    absoluteWrapperClassName?: string;
    backgroundImageURL: string;
}

export const RegionBackgroundWrapper: FC<
    PropsWithChildren<RegionBackgroundWrapperProps>
> = ({ className, absoluteWrapperClassName, backgroundImageURL, children }) => {
    return (
        <div
            className={trim`
                overflow-x-hidden relative w-full
                bg-no-repeat ${className}
            `}
            style={{
                backgroundImage: `url('${IMG_BASE_URL}/${backgroundImageURL}')`,
            }}
        >
            <div className={`absolute w-full ${absoluteWrapperClassName}`}>
                {children}
            </div>
        </div>
    );
};
