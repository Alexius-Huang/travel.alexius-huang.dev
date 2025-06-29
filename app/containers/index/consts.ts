import { IMG_BASE_URL } from '~/data-access/image-service';

export const BannerConfig = [
    {
        title: 'SANTORINI',
        location: 'Santorini, Greece',
        countryCode: 'gr',
        description:
            'Everywhere with whitewashed villages, sapphire domes and one of the most beautiful sunsets in the world.',
        date: { from: '2024-05-04', to: '2024-05-06' },
        desktop: `${IMG_BASE_URL}/highlight/gr-oia-landscape.webp`,
        desktopAlt: 'Sunset at Oia, Santorini at May of 2024',
        mobile: `${IMG_BASE_URL}/highlight/gr-santorini-vert-2.webp`,
        mobileAlt: 'Santorini trip at May of 2024',
    },
    {
        title: 'GIZA',
        location: 'Giza, Egypt',
        countryCode: 'eg',
        description:
            'Timeless symbol of ancient Egypt with legendary Pyramids and the Great Sphinx.',
        date: { from: '2024-09-24' },
        desktop: `${IMG_BASE_URL}/highlight/egp-gize-landscape.webp`,
        desktopAlt: 'Giza Pyramids at September of 2024',
        mobile: `${IMG_BASE_URL}/highlight/egp-gize-vert.webp`,
        mobileAlt: 'The Great Sphinx of Giza at September of 2024',
    },
];

// type Coordinate = [latitude: number, longitude: number];

/**
 *  Settlement is a word to encapsulate any area where people live,
 *  including city, town and villages ... regardless of size or formality
 */
// interface Settlement {
//     countryCode: string;
//     name: string;
//     coordinate: Coordinate;
// }

/* TODO: Define attraction / activity ... etc if needed */
// interface Attraction {}

// type DateFormat = `${string}-${string}-${string}`;
// interface TravelInfo {
//     country: Country;
//     date: [from: DateFormat, to: DateFormat];
// }

// const TravelInfoList: Array<TravelInfo> = [];
