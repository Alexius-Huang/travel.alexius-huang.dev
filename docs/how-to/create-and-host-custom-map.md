# Create & Host Custom Map

Creating and using a third-party map service is often the simplest approach. However, sometimes we only need to display a map of a specific area. Instead of hosting a large map server yourself, you can create a single, static file of map tiles and host it on a cloud storage service like Cloudflare R2 or Amazon S3.

This document will guide you through the process of creating a custom map with Protomaps, hosting it, and rendering it in your application.

## Protomaps & `pmtiles` Protocol

[Protomaps](https://protomaps.com/) is a powerful tool for creating single static file of map tiles with custom protocol: `pmtiles` combined with [HTTP Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests).

You can use it to select a specific geographic area, customize the map's style, and export it as a `.pmtiles` file.

Follow the guide from [Official Protomaps Doc](https://docs.protomaps.com/) or follow the guide written below for more details.

## Install [`pmtiles` CLI](https://docs.protomaps.com/pmtiles/cli)

Install the CLI via [Protomaps GitHub Releases](https://github.com/protomaps/go-pmtiles/releases).

Then put the commandline utility in binary executable path, such as: `/usr/local/bin`.

You should be able to execute `pmtiles --help`.

## Partially Extract Map Through Bounding Box

**Go to the website such as [bbox Finder](http://bboxfinder.com/#51.830755,4.742883,52.256198,5.552837)** and use the map to select the area you want to include in your custom map.

After selecting the map, copy the correct bounding box coordination:

![bbox Finder Coordination](https://images.alexius-huang.dev/docs/bbox-finder-coord.png)

Use the `pmtiles extract` and pass in `--bbox=<coord>` to extract and generate the `pmtiles` file, the command is as followed:

```bash
$ pmtiles extract https://build.protomaps.com/<yyyymmdd>.pmtiles <file-name>.pmtiles --bbox=<coord>
```

For more information, checkout [Offical Protomaps Doc](https://docs.protomaps.com/pmtiles/cli#extract) on `pmtiles extract` command, e.g. you can specify more options such as `minzoom`, `maxzoom` ... etc.

When executing the extract command, it should show something similar as below, for instance, we generate a `pmtiles` file called `my_area.pmtiles`:

```bash
$ pmtiles extract https://build.protomaps.com/20250711.pmtiles my_area.pmtiles --bbox=-123.416111,49.041615,-122.701307,49.406933

fetching 8 dirs, 8 chunks, 7 requests
Region tiles 4616, result tile entries 4091
fetching 4091 tiles, 62 chunks, 28 requests
fetching chunks 100% |█████████████████████████████████████████████████████████████████████████| (42/42 MB, 2.0 MB/s)
Completed in 34.548911917s with 4 download threads (118.41183305569795 tiles/s).
Extract required 38 total requests.
Extract transferred 44 MB (overfetch 0.05) for an archive size of 42 MB
```

## Upload & Host From Cloudflare R2

Next, we would need to uplaod the generated `pmtiles` file to any S3 compatible storage, in our travel website, we use the Cloudflare R2 service.

In order to also let the `pmtiles` be accessible, we must configure the CORS policy.

In R2 Object Storage, select the domain, then `Settings > CORS Policy`, edit it so that it contain the domain, `ExposeHeaders` with `etag` and `MaxAgeSeconds` of `3000`:

```json
[
    {
        "AllowedOrigins": [
            /* Any domains... */
        ],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedHeaders": ["*"],
        "ExposeHeaders": ["etag"],
        "MaxAgeSeconds": 3000
    }
]
```

That's it!

## Using [MapLibre GL](https://maplibre.org/) to Render Map

`MapLibre GL` is primarily used for rendering Vector map, there are also other alternative such as [Leaflet Map](https://leafletjs.com/), although it is also powerful, but Leaflet is primarily used for rendering Raster maps -- but in our case, we need Vector map renderer.

To use `MapLibre GL`, simply install it via:

```
pnpm add maplibre-gl
```

Next, include the styles (it is already included in [app/app.css](/app/app.css)):

```css
@import 'maplibre-gl/dist/maplibre-gl.css';
```

The following example for rendering Map using the `pmtiles` protocol, assume we want to render the map on an HTML element with id: `map-container`:

```ts
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';

/* Target HTML Element to be rendered */
const container = document.getElementById('map-container');

/* Setup pmtiles Protocol */
const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

/* Create the map */
const map = new maplibregl.Map({
    container,
    style: {
        version: 8,
        sources: {
            protomaps: {
                type: 'vector',
                url: `pmtiles://https://<r2-storage-domain>/path/to/my_area.pmtiles`,
            },
        },
    },
});

/* Clean up when unmounting element... */
map.remove();
maplibregl.removeProtocol('pmtiles');
```

There is already an implementation which wraps this logic in this repository, checkout the [`Map` Element](/app/components/map/map.tsx).

To checkout the available Map configuration, consult the type definition of `maplibregl.MapOptions`.

## Customize the Map Style

### The `style` Attribute in Map Configuration

The map's appearance is defined in a JSON file and passed as a configuration when creating map:

```ts
const style: maplibgl.StyleSpecification = {
    /* Your Styles... */
};

const map = new maplibregl.Map({
    container,
    style: {
        version: 8,
        sources: {
            protomaps: {
                type: 'vector',
                url: `pmtiles://https://<r2-storage-domain>/path/to/my_area.pmtiles`,
            },
        },
        ...style, // <-- include additional styles
    },
});
```

In this project, the map style is located at [`app/components/map/map-style.json`](/app/components/map/map-style.json). This file specifies the map's layers, colors, fonts, and other visual elements.

To checkout the available `style` configuration with the Map config, consult the type definition of `maplibgl.StyleSpecification`.

### Using [Maputnik](https://maplibre.org/maputnik/?layer=503634686%7E0#0.85/0/0) Editor to Edit Styles

Editing JSON file and then test the map style out is a way, however, it would be easier if we have GUI to configure styles, it could be done through `Maputnik` also by `maplibre.org`.

**But before using `Maputnik`, we must allow `maplibre.org` to be able to access our `pmtiles` file!**

First, we need to go to Cloudflare R2 and configure CORS policy, simply add `https://maplibre.org` as part of the allowed domain.

(Skip if you have the style JSON file with necessary attributes specified in `maplibregl.StyleSpecification` type) Before uploading the file to `Maputnik`, we need to temporarily add the `sources` attribute in `app/components/map/map-style.json`:

```json
{
    // ...
    "sources": {
        "protomaps": {
            "type": "vector",
            "url": "pmtiles://https://<domain>/path-to/<file-name>.pmtiles"
        }
    }
    // ...
}
```

Next, go to [`Maputnik` Editor](https://maplibre.org/maputnik/) and upload the style JSON file, through `Open > Open Style`:

![Open Style JSON to Maputnik](https://images.alexius-huang.dev/docs/upload-pmtiles-to-maputnik.png)

You should now be able to customize the style of the map.

After customization, simply click `Save > Save` to export the styled JSON file and replace the original one.

![Export Style JSON File](https://images.alexius-huang.dev/docs/export-styled-map-from-maputnik.png)
