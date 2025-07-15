import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
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

            const progressColor = useMemo(
                () => rgb(lineColor[theme ?? Theme.LIGHT]) as string,
                [lineColor, theme],
            );
            const progressBgColor = useMemo(
                () => rgb(lineProgressBgColor[theme ?? Theme.LIGHT]) as string,
                [lineProgressBgColor, theme],
            );

            const animationRef = useRef<number | null>(null);
            const startTimeRef = useRef<number | null>(null);

            useImperativeHandle(ref, () => ({
                /**
                 *  TODO: Understand the code and handle the following case:
                 *        1. able to revert animation
                 *        2. when theme changes, the animated line color should be changing!
                 *        3. Refactor
                 *        4. [Optional] able to execute and then revert animation
                 */
                animate: () => {
                    if (!mapInstance || !mapInstance.getLayer(layerId)) return;

                    if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current);
                    }

                    startTimeRef.current = null;

                    const step = (timestamp: number) => {
                        if (!startTimeRef.current)
                            startTimeRef.current = timestamp;
                        const elapsed = timestamp - startTimeRef.current;
                        const progress = Math.min(
                            elapsed / animationDuration,
                            1,
                        );

                        const gradient =
                            progress < 0.01
                                ? [
                                      'interpolate',
                                      ['linear'],
                                      ['line-progress'],
                                      0,
                                      progressBgColor,
                                      1,
                                      progressBgColor,
                                  ]
                                : progress > 1 - gradientTransitionAmount - 0.01
                                  ? [
                                        'interpolate',
                                        ['linear'],
                                        ['line-progress'],
                                        0,
                                        progressColor,
                                        1,
                                        progressColor,
                                    ]
                                  : [
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

                        mapInstance.setPaintProperty(
                            layerId,
                            'line-gradient',
                            gradient,
                        );

                        if (progress < 1) {
                            animationRef.current = requestAnimationFrame(step);
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
                        'line-gradient': [
                            'interpolate',
                            ['linear'],
                            ['line-progress'],
                            0,
                            progressBgColor,
                            1,
                            progressBgColor,
                        ],
                    },
                });
            }, [
                layerId,
                coords,
                mapInstance,
                theme,
                lineWidth,
                lineColor,
                progressBgColor,
            ]);

            useEffect(() => {
                if (!mapInstance) return;
                mapInstance.on('load', renderLines);
            }, [mapInstance]);

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
