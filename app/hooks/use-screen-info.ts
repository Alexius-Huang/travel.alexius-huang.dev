import { useEffect, useState } from 'react';

type ScreenType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const BREAKPOINTS: Record<ScreenType, number> = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

function getScreenType(width: number): ScreenType {
    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS['xl']) return 'xl';
    if (width >= BREAKPOINTS['lg']) return 'lg';
    if (width >= BREAKPOINTS['md']) return 'md';
    if (width >= BREAKPOINTS['sm']) return 'sm';
    return 'xs';
}

export function useScreenInfo() {
  const [width, setWidth] = useState<number>(() => typeof window === 'undefined' ? 0 : window.innerWidth);
  const [screenType, setScreenType] = useState<ScreenType>(() => getScreenType(typeof window === 'undefined' ? 0 : window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setScreenType(getScreenType(newWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { type: screenType, width };
}
