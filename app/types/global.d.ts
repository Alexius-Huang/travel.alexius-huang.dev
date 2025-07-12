declare global {
    /* For exposing the map variable in order to debug on client */
    var maps: undefined | Record<string, maplibregl.Map>;
}

export {};
