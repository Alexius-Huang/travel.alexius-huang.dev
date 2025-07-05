import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const ChevronRightOutlineIcon: FC<IconProps> = ({
    size = 'md',
    className = '',
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`${sizeMapping[size]} ${className}`}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
    </svg>
);
