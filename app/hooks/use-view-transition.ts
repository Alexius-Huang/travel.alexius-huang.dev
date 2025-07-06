import { useMemo } from "react";
import { useViewTransitionState } from "react-router";

function toCamelCase(input: string) {
    return input.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function useViewTransition(link: string, classes: Array<string>): Record<string, string> {
    const isTransitioning = useViewTransitionState(link);

    const result = useMemo(() => {
        if (isTransitioning) {
            return classes.reduce((prev, cur) => ({
                ...prev,
                [toCamelCase(cur)]: `v-trans-${cur}`
            }), {});
        }

        return classes.reduce((prev, cur) => ({
            ...prev,
            [toCamelCase(cur)]: ''
        }), {});
    }, [isTransitioning]);

    return result;
}
