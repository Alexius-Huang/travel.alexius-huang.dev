import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const ChevronLeftOutlineIcon: FC<IconProps> = ({
    size = 'md',
    className = '',
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${sizeMapping[size]} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);
