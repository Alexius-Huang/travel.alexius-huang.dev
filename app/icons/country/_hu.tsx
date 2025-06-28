import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const HungaryFlagIcon: FC<IconProps> = ({ className, size = 'md' }) => (
<svg className={`${sizeMapping[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" id="flag-icons-hu" viewBox="0 0 512 512">
  <g fillRule="evenodd">
    <path fill="#fff" d="M512 512H0V0h512z"/>
    <path fill="#388d00" d="M512 512H0V341.3h512z"/>
    <path fill="#d43516" d="M512 170.8H0V.1h512z"/>
  </g>
</svg>
)
