import type { FC } from 'react';
import type { IconProps } from '../type';
import { sizeMapping } from '../const';

export const BosniaAndHerzegovinaFlagIcon: FC<IconProps> = ({ className, size = 'md' }) => (
<svg className={`${sizeMapping[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" id="flag-icons-ba" viewBox="0 0 512 512">
  <defs>
    <clipPath id="ba-a">
      <path fillOpacity=".7" d="M0 0h512v512H0z"/>
    </clipPath>
  </defs>
  <g fillRule="evenodd" clipPath="url(#ba-a)">
    <path fill="#009" d="M0 0h512v512H0z"/>
    <path fill="#fc0" d="m77 0 437 437V0z"/>
    <path fill="#FFF" d="m461.4 470.4-26.1-19.1-26.9 19 10.2-31.2-26.4-19.2h32.7l10.2-31 10 31.1 32.8.1-26.2 19.4zm76.7 10.4h-32.7l-10-31.2-10.2 31.1h-32.8l26.4 19.2-10.1 31.2 26.8-19 26.2 19-9.8-30.9zM391.8 379.6l26.2-19.4h-32.7L375.2 329 365 360h-32.7l26.4 19.3-10.1 31.1 26.8-19 26.1 19.1zm-60.3-60.4 26.2-19.4-32.8-.1-10-31.2-10.2 31.2-32.7-.1 26.4 19.2-10.2 31.2 26.9-19 26.1 19.1zm-59.7-59.7 26.2-19.4h-32.7l-10.1-31.2L245 240h-32.7l26.4 19.2-10.1 31.2 26.8-19 26.1 19zm-60.4-60.3 26.2-19.3-32.8-.1-10-31.2-10.2 31.2-32.7-.1 26.4 19.2-10.2 31.2 26.9-19 26.1 19-9.7-30.8zm-59.7-59.9L178 120l-32.7-.1-10-31.2-10.3 31.1H92.2l26.4 19.2-10.1 31.2 26.8-19 26.1 19zm-60-60L118 60l-32.7-.1-10-31.2L65 59.8H32.2L58.6 79l-10.1 31.2 26.8-19 26.2 19zm-60-60L58 0 25.2-.1l-10-31.2L4.8-.2h-32.7L-1.4 19l-10.1 31.2 26.8-19 26.1 19z"/>
  </g>
</svg>
)
