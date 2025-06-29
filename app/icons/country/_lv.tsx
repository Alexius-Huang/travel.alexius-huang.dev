import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const LatviaFlagIcon: FC<IconProps> = ({ className, size = 'md' }) => (
<svg className={`${sizeMapping[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" id="flag-icons-lv" viewBox="0 0 512 512">
  <g fillRule="evenodd">
    <path fill="#fff" d="M0 0h512v512H0z"/>
    <path fill="#981e32" d="M0 0h512v204.8H0zm0 307.2h512V512H0z"/>
  </g>
</svg>
)
