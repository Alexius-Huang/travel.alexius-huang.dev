export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number,
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    let lastFunc: NodeJS.Timeout;
    let lastRan: number;

    return function (this: any, ...args: Parameters<T>) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(
                () => {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                },
                limit - (Date.now() - lastRan),
            );
        }
    };
}
