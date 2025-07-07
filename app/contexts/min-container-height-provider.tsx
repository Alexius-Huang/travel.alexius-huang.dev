import {
    createContext,
    useEffect,
    useState,
    type FC,
    type PropsWithChildren,
    type RefObject,
} from 'react';
import { useHydration } from '~/hooks/use-hydration';
import { throttle } from '~/utils/throttle';

export const MinContainerHeightContext = createContext<number>(0);

export interface MinContainerHeightProviderProps {
    footerRef: RefObject<HTMLElement | null>;
}

/**
 *  "Min Container Height" calculates the container height required in order to let
 *  footer be properly placed in the bottom of the page
 */
export const MinContainerHeightProvider: FC<PropsWithChildren<MinContainerHeightProviderProps>> = ({ children, footerRef }) => {
    const hydrated = useHydration();
    const [minContainerHeight, setMinContainerHeight] = useState(0);

    useEffect(() => {
        if (!hydrated) return;

        const footer = footerRef.current;
        function calculateMinHeight() {
            if (!footer) {
                console.warn('Unable to get footer ref to calculate minium container height.');
                return;
            }

            const footerStyles = window.getComputedStyle(footer);
            const footerMargin = Number.parseInt(footerStyles.marginTop) + Number.parseInt(footerStyles.marginBottom);
            const footerHeight = footerMargin + footer.offsetHeight;
            setMinContainerHeight(window.innerHeight - footerHeight);
        }

        calculateMinHeight();

        const resizeObserver = new ResizeObserver(throttle(calculateMinHeight, 1000 / 60));
        resizeObserver.observe(document.body);
        return () => resizeObserver.disconnect();
    }, [hydrated]);

    return (
        <MinContainerHeightContext.Provider value={minContainerHeight}>
            {children}
        </MinContainerHeightContext.Provider>
    );
};
