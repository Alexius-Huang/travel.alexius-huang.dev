import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const ItalyFlagIcon: FC<IconProps> = ({ className, size = 'md' }) => (
<svg className={`${sizeMapping[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" id="flag-icons-it" viewBox="0 0 512 512">
  <g fillRule="evenodd" strokeWidth="1pt">
    <path fill="#fff" d="M0 0h512v512H0z"/>
    <path fill="#009246" d="M0 0h170.7v512H0z"/>
    <path fill="#ce2b37" d="M341.3 0H512v512H341.3z"/>
  </g>
</svg>
)
