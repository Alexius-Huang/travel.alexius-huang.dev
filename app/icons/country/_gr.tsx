import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const GreeceFlagIcon: FC<IconProps> = ({
    size = 'md',
    className = '',
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        id="flag-icons-gr"
        viewBox="0 0 512 512"
        className={`${sizeMapping[size]} ${className}`}
    >
        <path fill="#0d5eaf" fillRule="evenodd" d="M0 0h512v57H0z" />
        <path fill="#fff" fillRule="evenodd" d="M0 57h512v57H0z" />
        <path fill="#0d5eaf" fillRule="evenodd" d="M0 114h512v57H0z" />
        <path fill="#fff" fillRule="evenodd" d="M0 171h512v57H0z" />
        <path fill="#0d5eaf" fillRule="evenodd" d="M0 228h512v56.9H0z" />
        <path fill="#fff" fillRule="evenodd" d="M0 284.9h512v57H0z" />
        <path fill="#0d5eaf" fillRule="evenodd" d="M0 341.9h512v57H0z" />
        <path fill="#fff" fillRule="evenodd" d="M0 398.9h512v57H0z" />
        <path fill="#0d5eaf" d="M0 0h284.9v284.9H0z" />
        <g fill="#fff" fillRule="evenodd" strokeWidth="1.3">
            <path d="M114 0h57v284.9h-57z" />
            <path d="M0 114h284.9v57H0z" />
        </g>
        <path fill="#0d5eaf" fillRule="evenodd" d="M0 455h512v57H0z" />
    </svg>
);
