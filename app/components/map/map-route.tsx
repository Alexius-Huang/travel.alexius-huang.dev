import { useCallback, useEffect, useMemo, type FC } from 'react';
import type { UseMapInstanceType } from '~/components/map/create-map-components';
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
     *  Accept number between 0 ~ 100 where it introduces line progress
     *  The progress would be colored through `lineColor` and the not-yet
     *  progressed part would be colored through `lineProgressBgColor`
     */
    lineProgress?: number;
}

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

export const MapRoute: (
    useMapInstance: UseMapInstanceType,
) => FC<MapRouteProps> =
    (useMapInstance) =>
    ({
        coords,
        sourceName,
        lineWidth = 4,
        lineColor = {
            [Theme.DARK]: colors.blue[500],
            [Theme.LIGHT]: colors.yellow[300],
        },
        lineProgressBgColor = {
            [Theme.DARK]: 'transparent',
            [Theme.LIGHT]: 'transparent',
        },
        lineProgress = 100,
    }) => {
        const mapInstance = useMapInstance();
        const [theme] = useTheme();

        lineProgress =
            (lineProgress < 0 ? 0 : lineProgress > 100 ? 100 : lineProgress) /
            100;

        const progressColor = useMemo(
            () => rgb(lineColor[theme ?? Theme.LIGHT]) as string,
            [lineColor, theme],
        );
        const progressBgColor = useMemo(
            () => rgb(lineProgressBgColor[theme ?? Theme.LIGHT]) as string,
            [lineProgressBgColor, theme],
        );

        const derivedLineGradient =
            useMemo<maplibregl.ExpressionSpecification>(() => {
                const result: maplibregl.ExpressionSpecification = [
                    'interpolate',
                    ['linear'],
                    ['line-progress'],
                ];

                if (lineProgress === 0) {
                    result.push(0, progressBgColor, 1, progressBgColor);
                    return result;
                }

                if (lineProgress === 1) {
                    result.push(0, progressColor, 1, progressColor);
                    return result;
                }

                result.push(
                    0,
                    progressColor,
                    lineProgress - 0.001,
                    progressColor,
                    lineProgress,
                    progressBgColor,
                    1,
                    progressBgColor,
                );
                return result;
            }, [lineProgress, progressColor, progressBgColor, theme]);

        const previousSourceName = usePrevious(sourceName);
        const layerId = `$route-${sourceName}`;

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
                    'line-gradient': derivedLineGradient,
                },
            });
        }, [
            layerId,
            coords,
            mapInstance,
            theme,
            lineWidth,
            lineColor,
            derivedLineGradient,
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

        useEffect(() => {
            if (!mapInstance || !mapInstance.isStyleLoaded()) return;

            mapInstance.setPaintProperty(
                layerId,
                'line-gradient',
                derivedLineGradient,
            );
        }, [mapInstance, theme, sourceName, derivedLineGradient]);

        return <></>;
    };
