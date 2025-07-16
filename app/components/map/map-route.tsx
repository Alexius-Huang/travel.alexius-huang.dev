import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef
} from 'react';
import type { UseMapInstanceType } from './create-map-components';
import { usePrevious } from '~/hooks/use-previous';
import { Theme, useTheme } from 'remix-themes';
import colors from 'tailwindcss/colors';
import { formatRgb as rgb } from 'culori';

type Coordinate = [lat: number, lng: number];

export interface MapRouteProps {
    coords: Array<Coordinate>;
    sourceName: string;

    lineWidth?: number;
    lineColor?: { [K in Theme]: string };
    lineProgressBgColor?: { [K in Theme]: string };

    /**
     *  Accepts number between 0 ~ 100 where the progress is loading, it
     *  will have amount of gradient transition
     */
    gradientTransitionAmount?: number;
}

export interface MapRouteRef {
    animate: () => void;
    reverseAnimate: () => void;
}

const animationDuration = 1000;

function geojsomFromCoorindates(coordinates: Array<Coordinate>) {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates,
                },
            },
        ],
    } as GeoJSON.GeoJSON;
}

export const MapRoute = (useMapInstance: UseMapInstanceType) =>
    forwardRef<MapRouteRef, MapRouteProps>(
        (
            {
                coords,
                sourceName,
                lineWidth = 4,
                lineColor = {
                    [Theme.DARK]: colors.blue[500],
                    [Theme.LIGHT]: colors.yellow[300],
                },
                lineProgressBgColor = {
                    [Theme.DARK]: colors.gray[400],
                    [Theme.LIGHT]: colors.gray[500],
                },
                gradientTransitionAmount = 5,
            },
            ref,
        ) => {
            const mapInstance = useMapInstance();
            const [theme] = useTheme();

            gradientTransitionAmount /= 100;

            const progressColorRef = useRef<string>('');
            const progressBgColorRef = useRef<string>('');

            useEffect(() => {
                progressColorRef.current = rgb(lineColor[theme ?? Theme.LIGHT]) as string;
                progressBgColorRef.current = rgb(lineProgressBgColor[theme ?? Theme.LIGHT]) as string;
            }, [theme, lineColor, lineProgressBgColor]);

            const animationRef = useRef<number | null>(null);
            const startTimeRef = useRef<number | null>(null);
            const isAnimatedRef = useRef(false);
            const isAnimatingRef = useRef(false);

            const deriveGradientStyle = useCallback(
                (progress: number): maplibregl.ExpressionSpecification => {
                    const progressColor = progressColorRef.current;
                    const progressBgColor = progressBgColorRef.current;
                    if (progress < 0.01) {
                        return [
                            'interpolate',
                            ['linear'],
                            ['line-progress'],
                            0,
                            progressBgColor,
                            1,
                            progressBgColor,
                        ];
                     } else if (progress > 1 - gradientTransitionAmount - 0.01) {
                        return [
                            'interpolate',
                            ['linear'],
                            ['line-progress'],
                            0,
                            progressColor,
                            1,
                            progressColor,
                        ];
                     } else {
                        return [
                            'interpolate',
                            ['linear'],
                            ['line-progress'],
                            0,
                            progressColor,
                            progress,
                            progressColor,
                            progress + gradientTransitionAmount,
                            progressBgColor,
                            1,
                            progressBgColor,
                        ];
                     }
                },
                [gradientTransitionAmount],
            );

            const animateRejectFuncRef =
                useRef<(reason?: any) => void | null>(null);
            useImperativeHandle(ref, () => ({
                /**
                 *  TODO: Understand the code and handle the following case:
                 *        2. when theme changes, the animated line color should be changing!
                 *        3. refactor the code
                 *        4. [Optional] able to execute and then revert animation
                 */
                animate: async () => {
                    if (!mapInstance) return;

                    animateRejectFuncRef.current?.();

                    function waitForLayerExist(
                        map: maplibregl.Map,
                    ): Promise<void> {
                        return new Promise((resolve, reject) => {
                            animateRejectFuncRef.current = reject;
                            (function check() {
                                if (map.getLayer(layerId)) {
                                    resolve();
                                } else {
                                    requestAnimationFrame(check);
                                }
                            })();
                        });
                    }

                    try {
                        await waitForLayerExist(mapInstance);
                    } catch {
                        return;
                    }

                    const isAnimated = isAnimatedRef.current;
                    if (isAnimated) return;

                    if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current);
                    }

                    startTimeRef.current = null;
                    isAnimatedRef.current = true;
                    isAnimatingRef.current = true;

                    const step = (timestamp: number) => {
                        if (!startTimeRef.current)
                            startTimeRef.current = timestamp;
                        const elapsed = timestamp - startTimeRef.current;
                        const progress = Math.min(
                            elapsed / animationDuration,
                            1,
                        );

                        mapInstance.setPaintProperty(
                            layerId,
                            'line-gradient',
                            deriveGradientStyle(progress),
                        );

                        if (progress < 1) {
                            animationRef.current = requestAnimationFrame(step);
                        } else {
                            isAnimatingRef.current = false;
                        }
                    };

                    animationRef.current = requestAnimationFrame(step);
                },

                reverseAnimate: () => {
                    if (!mapInstance || !mapInstance.getLayer(layerId)) return;

                    const isAnimated = isAnimatedRef.current;
                    if (!isAnimated) return;

                    if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current);
                    }

                    startTimeRef.current = null;
                    isAnimatedRef.current = false;
                    isAnimatingRef.current = true;

                    const step = (timestamp: number) => {
                        if (!startTimeRef.current)
                            startTimeRef.current = timestamp;
                        const elapsed = timestamp - startTimeRef.current;
                        const progress =
                            1 - Math.min(elapsed / animationDuration, 1);

                        mapInstance.setPaintProperty(
                            layerId,
                            'line-gradient',
                            deriveGradientStyle(progress),
                        );

                        if (progress > 0) {
                            animationRef.current = requestAnimationFrame(step);
                        } else {
                            isAnimatingRef.current = false;
                        }
                    };

                    animationRef.current = requestAnimationFrame(step);
                },
            }));

            const previousSourceName = usePrevious(sourceName);
            const layerId = `$route-${sourceName}`;

            // TODO: probably we might not need this function as this is
            //       only be used in onLoad for initial load
            const renderLines = useCallback(() => {
                if (!mapInstance) return;

                if (mapInstance.getLayer(layerId)) {
                    mapInstance.removeLayer(layerId);
                }
                if (mapInstance.getSource(sourceName)) {
                    mapInstance.removeSource(sourceName);
                }

                mapInstance.addSource(sourceName, {
                    type: 'geojson',
                    data: geojsomFromCoorindates(coords),

                    // This enables the ability to let maplibre-gl to
                    // calculate the line progress and apply line-gradient
                    lineMetrics: true,
                });

                mapInstance.addLayer({
                    id: layerId,
                    type: 'line',
                    source: sourceName,
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-width': lineWidth,
                        'line-gradient': deriveGradientStyle(isAnimatedRef.current ? 100 : 0)
                    },
                });
            }, [
                layerId,
                coords,
                mapInstance,
                theme,
                lineWidth,
                lineColor
            ]);

            useEffect(() => {
                if (!mapInstance) return;
                mapInstance.on('load', renderLines);
            }, [mapInstance]);

            useEffect(() => {
                if (isAnimatingRef.current) return;
                renderLines();
            }, [theme]);

            useEffect(() => {
                if (
                    !mapInstance ||
                    !previousSourceName ||
                    previousSourceName === sourceName
                )
                    return;
                mapInstance.removeLayer(`$route-${previousSourceName}`);
                mapInstance.removeSource(previousSourceName);
            }, [previousSourceName]);

            return <></>;
        },
    );
