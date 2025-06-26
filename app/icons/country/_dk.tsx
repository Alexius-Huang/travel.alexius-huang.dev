import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const DenmarkFlagIcon: FC<IconProps> = ({ className, size = 'md' }) => (
<svg className={`${sizeMapping[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" id="flag-icons-dk" viewBox="0 0 512 512">
  <path fill="#c8102e" d="M0 0h512.1v512H0z"/>
  <path fill="#fff" d="M144 0h73.1v512H144z"/>
  <path fill="#fff" d="M0 219.4h512.1v73.2H0z"/>
</svg>
)
