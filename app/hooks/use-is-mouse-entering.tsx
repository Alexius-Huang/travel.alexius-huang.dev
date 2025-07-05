import { useEffect, useState, type RefObject } from 'react';
import { useHydration } from './use-hydration';

/**
 *  This hook detects whether the mouse is entering some specific
 *  ref UI
 */
export function useIsMouseEntering<T extends HTMLElement>(
    ref: RefObject<T | null>,
) {
    const [isMouseEntered, setIsMouseEntered] = useState(false);
    const isHydrated = useHydration();

    useEffect(() => {
        if (!isHydrated || !ref.current) return;
        const el = ref.current;

        function mouseEnterHandler() {
            setIsMouseEntered(true);
        }
        function mouseLeaveHandler() {
            setIsMouseEntered(false);
        }
        el.addEventListener('mouseenter', mouseEnterHandler);
        el.addEventListener('mouseleave', mouseLeaveHandler);

        return () => {
            el.removeEventListener('mouseenter', mouseEnterHandler);
            el.removeEventListener('mouseleave', mouseLeaveHandler);
        };
    }, [isHydrated]);

    return isMouseEntered;
}
