import { useState, useEffect } from 'react';
import { throttle } from '~/utils/throttle';
import { useHydration } from './use-hydration';

const breakpoints = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export const Breakpoint = {
    XS: 0,
    SM: 1,
    MD: 2,
    LG: 3,
    XL: 4,
    XXL: 5, // Using XXL for 2xl to avoid conflict with '2xl' string
    BASE: -1, // For widths below the smallest breakpoint
} as const;

type BreakpointName = keyof typeof breakpoints;
type BreakpointValue = (typeof Breakpoint)[keyof typeof Breakpoint];

export function useBreakpoint() {
    const isHydrated = useHydration();
    const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointValue>(
        Breakpoint.BASE,
    );

    useEffect(() => {
        if (!isHydrated) return;

        function updateBreakpoint(width: number) {
            let newBreakpointValue: BreakpointValue = Breakpoint.BASE;
            // Iterate through breakpoints in ascending order
            const sortedBreakpoints = Object.entries(breakpoints).sort(
                ([, valA], [, valB]) => valA - valB,
            );

            for (const [name, value] of sortedBreakpoints) {
                if (width < value) break;

                switch (name as BreakpointName) {
                    case 'xs':
                        newBreakpointValue = Breakpoint.XS;
                        break;
                    case 'sm':
                        newBreakpointValue = Breakpoint.SM;
                        break;
                    case 'md':
                        newBreakpointValue = Breakpoint.MD;
                        break;
                    case 'lg':
                        newBreakpointValue = Breakpoint.LG;
                        break;
                    case 'xl':
                        newBreakpointValue = Breakpoint.XL;
                        break;
                    case '2xl':
                        newBreakpointValue = Breakpoint.XXL;
                        break;
                    default:
                        newBreakpointValue = Breakpoint.BASE;
                        break;
                }
            }
            setCurrentBreakpoint(newBreakpointValue);
        }

        // Initial set
        updateBreakpoint(window.innerWidth);

        const throttledUpdate = throttle(updateBreakpoint, 200); // Throttle for 200ms

        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries[0]) return;
            throttledUpdate(entries[0].contentRect.width);
        });

        resizeObserver.observe(document.body);

        return () => {
            if (!isHydrated) return;
            resizeObserver.disconnect();
        };
    }, [isHydrated]);

    return currentBreakpoint;
}
