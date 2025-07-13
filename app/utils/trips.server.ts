import type { TripDetails } from '~/data-access/trips';

// TODO: move this to database and deprecate this page
const mapPins: TripDetails['mapPins'] = [
    {
        name: 'New York City',
        coord: [-74.006, 40.7128]
    },
    {
        name: 'Philadelphia',
        coord: [-75.1652, 39.9526]
    },
    {
        name: 'Washington D.C.',
        coord: [-77.0369, 38.9072]
    }
];

export const TRIPS: Array<TripDetails> = [
    {
        id: 1,
        title: 'E Pluribus Unum',
        subtitle:
            "Tracing America's Roots Through Its Political & Financial Heartlands",
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: [
            'US East Coast',
            'Long Trip',
            'Capital Tour',
            'Metropolis',
            'New York',
            'Washington D.C.',
            'Pennsylvania',
        ],
        countryCodes: ['us'],
        date: { from: '2025-04-30', to: '2025-05-12' },
        map: {
            pmtilesName: '2025-05-us.v2',
            maxBounds: [-78.898165, 37.787573, -71.3397, 41.610389],
            maxZoom: 10,
            center: [-74.63632406560839, 39.7254668759974],
        },
        mapPins,
        routeFileName: '2025-05-us'
    },
    {
        id: 2,
        title: 'Of Cobblestones & Steel',
        subtitle:
            'A Mellow Meander From Medieval Alleys to Automotive Heartland in Lower Saxony',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['Lower Saxony', 'Medieval Town', 'Industry', 'Short Trip'],
        countryCodes: ['de'],
        date: { from: '2025-04-18', to: '2025-04-20' },

        // TODO: replcae this to germany map
        map: {
            pmtilesName: '2025-05-us.v2',
            maxBounds: [-78.898165, 37.787573, -71.3397, 41.610389],
            maxZoom: 10,
            center: [-74.63632406560839, 39.7254668759974],
        },
        mapPins,
        routeFileName: '2025-05-us'
    },
    {
        id: 3,
        title: 'Tuscan Whispers',
        subtitle:
            "From the Leaning Tower to Brunelleschi's Dome, Explore The Heart of The Renaissance",
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['Renaissance', 'Art', 'UNESCO Heritage', 'Short Trip'],
        countryCodes: ['it'],
        date: { from: '2024-11-29', to: '2024-12-02' },

        // TODO: replcae this to italy map
        map: {
            pmtilesName: '2025-05-us.v2',
            maxBounds: [-78.898165, 37.787573, -71.3397, 41.610389],
            maxZoom: 10,
            center: [-74.63632406560839, 39.7254668759974],
        },
        mapPins,
        routeFileName: '2025-05-us'
    },
];
