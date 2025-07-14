import {
    createContext,
    useContext,
    type FC,
    type PropsWithChildren,
} from 'react';
import { Map } from './map';
import { MapPin } from './map-pin';
import { MapRoute } from './map-route';

interface MapInstanceProviderProps {
    instance: maplibregl.Map | null;
}

export type MapInstanceProviderType = FC<
    PropsWithChildren<MapInstanceProviderProps>
>;
export type UseMapInstanceType = () => maplibregl.Map | null;

/**
 *  To use the Map related component in React composition pattern, we have to
 *  use the HOC in order to assign each component with its own context
 */
export function createMapComponents() {
    const MapInstanceContext = createContext<maplibregl.Map | null>(null);

    const MapInstanceProvider: FC<
        PropsWithChildren<MapInstanceProviderProps>
    > = ({ children, instance }) => {
        return (
            <MapInstanceContext.Provider value={instance}>
                {children}
            </MapInstanceContext.Provider>
        );
    };

    function useMapInstance() {
        return useContext(MapInstanceContext);
    }

    return {
        Map: Map(MapInstanceProvider),
        MapPin: MapPin(useMapInstance),
        MapRoute: MapRoute(useMapInstance)
    };
}
