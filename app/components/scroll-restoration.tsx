import { useEffect, useRef, type FC, type RefObject } from 'react';
import { useLocation } from 'react-router';
import { useHydration } from '~/hooks/use-hydration';
import { throttle } from '~/utils/throttle';

export interface ScrollRestorationProps {
    ref: RefObject<HTMLElement | null>;
}

/**
 *  This custom scroll restoration is being created because instead of targeting
 *  the body, we can target specific element for scroll restoration of that container
 */
export const ScrollRestoration: FC<ScrollRestorationProps> = ({ ref }) => {
    const scrollLocationMap = useRef<Record<string, number>>({});
    const isHydrated = useHydration();
    const location = useLocation();

    useEffect(() => {
        if (!isHydrated || !ref.current) return;
        const el = ref.current;

        function handleCacheScrollPosition(e: Event) {
            const { pathname } = window.location;
            scrollLocationMap.current[pathname] = el.scrollTop;
        }

        const throttledEventHandler = throttle(handleCacheScrollPosition, 100);
        el.addEventListener('scroll', throttledEventHandler);
        return () => {
            el.removeEventListener('scroll', throttledEventHandler);
        };
    }, [isHydrated]);
    console.log(scrollLocationMap.current)

    useEffect(() => {
        if (!ref.current) return;

        const scrollPosition = scrollLocationMap.current[location.pathname];
        if (!scrollPosition) return;

        ref.current.scrollTo({ top: scrollPosition });
    }, [location]);

    return <></>;
};
