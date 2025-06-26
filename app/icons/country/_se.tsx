import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const SwedenFlagIcon: FC<IconProps> = ({ className, size = 'md' }) => (
<svg className={`${sizeMapping[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" id="flag-icons-se" viewBox="0 0 512 512">
  <path fill="#005293" d="M0 0h512v512H0z"/>
  <path fill="#fecb00" d="M134 0v204.8H0v102.4h134V512h102.4V307.2H512V204.8H236.4V0z"/>
</svg>
)
