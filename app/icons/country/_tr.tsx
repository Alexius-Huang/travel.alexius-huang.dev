import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const TurkeyFlagIcon: FC<IconProps> = ({ className, size = 'md' }) => (
<svg className={`${sizeMapping[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" id="flag-icons-tr" viewBox="0 0 512 512">
  <g fillRule="evenodd">
    <path fill="#e30a17" d="M0 0h512v512H0z"/>
    <path fill="#fff" d="M348.8 264c0 70.6-58.3 127.9-130.1 127.9s-130.1-57.3-130.1-128 58.2-127.8 130-127.8S348.9 193.3 348.9 264z"/>
    <path fill="#e30a17" d="M355.3 264c0 56.5-46.6 102.3-104.1 102.3s-104-45.8-104-102.3 46.5-102.3 104-102.3 104 45.8 104 102.3z"/>
    <path fill="#fff" d="m374.1 204.2-1 47.3-44.2 12 43.5 15.5-1 43.3 28.3-33.8 42.9 14.8-24.8-36.3 30.2-36.1-46.4 12.8z"/>
  </g>
</svg>
)
