import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const XMarkOutlineIcon: FC<IconProps> = ({
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
            d="M6 18 18 6M6 6l12 12"
        />
    </svg>
);
