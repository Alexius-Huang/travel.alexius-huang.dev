import { useEffect, useState } from "react";

/**
 *  Function which returns state on page is client hydrated 
 */
export function useHydration() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return isHydrated;
}
