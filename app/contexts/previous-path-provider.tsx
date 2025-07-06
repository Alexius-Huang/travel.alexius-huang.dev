import {
    createContext,
    useEffect,
    useRef,
    type FC,
    type PropsWithChildren,
} from 'react';
import { useLocation } from 'react-router';

export const PreviousPathContext = createContext<string | null>(null);

export const PreviousPathProvider: FC<PropsWithChildren> = ({ children }) => {
    const location = useLocation();
    const previousLocationRef = useRef<string | null>(null);

    useEffect(() => {
        previousLocationRef.current = location.pathname;
    }, [location]);

    return (
        <PreviousPathContext.Provider value={previousLocationRef.current}>
            {children}
        </PreviousPathContext.Provider>
    );
};
