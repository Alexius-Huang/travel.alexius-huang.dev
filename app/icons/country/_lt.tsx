import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const LithuaniaFlagIcon: FC<IconProps> = ({ className, size = 'md' }) => (
<svg className={`${sizeMapping[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" id="flag-icons-lt" viewBox="0 0 512 512">
  <g fillRule="evenodd" strokeWidth="1pt" transform="scale(.51314 1.0322)">
    <rect width="1063" height="708.7" fill="#006a44" rx="0" ry="0" transform="scale(.93865 .69686)"/>
    <rect width="1063" height="236.2" y="475.6" fill="#c1272d" rx="0" ry="0" transform="scale(.93865 .69686)"/>
    <path fill="#fdb913" d="M0 0h997.8v164.6H0z"/>
  </g>
</svg>
)
