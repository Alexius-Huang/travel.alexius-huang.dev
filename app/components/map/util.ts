export function waitForStyleLoaded(
    map: maplibregl.Map,
): [promise: Promise<void>, stopFunc: (reason?: any) => void] {
    let stopFunc: (reason?: any) => void;

    const promise = ((map: maplibregl.Map): Promise<void> =>
        new Promise((resolve, reject) => {
            stopFunc = reject;

            const check = () => {
                if (map.isStyleLoaded()) {
                    resolve();
                } else {
                    requestAnimationFrame(check); // forces visual tick
                }
            };
            check();
        }))(map);

    return [promise, stopFunc!];
}
