import {
    createContext,
    useContext,
    type FC,
    type PropsWithChildren,
} from 'react';
import { Map } from '~/components/map';
import { MapPin } from '~/components/map/map-pin';

interface MapInstanceProviderProps {
    instance: maplibregl.Map | null;
}

export type MapInstanceProviderType = FC<PropsWithChildren<MapInstanceProviderProps>>;
export type UseMapInstanceType = () => maplibregl.Map | null;

export function createMapComponents() {
    const MapInstanceContext = createContext<maplibregl.Map | null>(null);

    const MapInstanceProvider: FC<PropsWithChildren<MapInstanceProviderProps>> = ({ children, instance}) => {
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
        MapPin: MapPin(useMapInstance)
     };
}

