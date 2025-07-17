import type { FC, HTMLProps } from "react";
import { trim } from "~/utils/trim";

export interface IconedMapMarkerProps extends HTMLProps<HTMLDivElement> {
    size: number;
    iconUrl: string;
    iconAlt: string;
}

/**
 *  This is to be used to serve as children of MapPin component
 */
export const IconedMapMarker: FC<IconedMapMarkerProps> = ({
    size,
    iconUrl,
    iconAlt,
    ...props
}) => {
    return (
        <div
            {...props}
            className={trim`
                flex flex-col items-center
                translate-y-[-24px] origin-bottom hover:scale-125 transition-transform duration-200
                ${props.className ?? ''}
            `}
        >
            <div
                className={`relative rounded-[50%] bg-yellow-300 dark:bg-blue-500`}
                style={{
                    width: size + 8,
                    height: size + 8
                }}
            >
                <img
                    className='absolute z-1 left-0 right-0 top-0 bottom-0 m-auto rounded-[50%]'
                    width={size}
                    height={size}
                    src={iconUrl}
                    alt={iconAlt}
                />
            </div>
            <div
                className={`w-0 h-0 mt-[-4px] border-y-[28px] border-x-[8px] border-t-yellow-300 dark:border-t-blue-500 border-b-transparent border-l-transparent border-r-transparent`}
            />
        </div>
    );
};
