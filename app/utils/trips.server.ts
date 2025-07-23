import type { TripDetails } from '~/data-access/trips';

// TODO: Replace with actual data
const LOREM_IPSUM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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
            center: [-75.60154093439161, 39.7254668759974],
            zoomLevel: {
                init: 7,
                focus: 8,
            },
        },
        locations: [
            {
                name: 'New York City',
                nameId: 'new-york-city',
                description:
                    "Home to legendary landmarks like the Statue of Liberty, the Empire State Building, and the 9/11 Memorial, this city is woven with history that helped shape the modern world. But it's not just about the past—its skyline is a masterpiece of modern ambition, glowing at sunset and sparkling after dark. From the cobblestone streets of Lower Manhattan to the soaring views from Top of the Rock, NYC is where history and innovation collide.",
                coord: [-74.006, 40.7128],
                date: { from: '2025-04-30', to: '2025-05-05' },
            },
            {
                name: 'Philadelphia',
                nameId: 'philadelphia',
                description:
                    "Walk the same streets where the Declaration of Independence was signed, stand beneath the Liberty Bell, and explore buildings that helped shape a nation. But beyond the founding chapters, Philly is a city with a chill soul—tree-lined neighborhoods, vibrant murals, cozy cafés, and a food scene that goes way beyond cheesesteaks. It's where past and present coexist effortlessly, making it the perfect place to learn, wander, and unwind.",
                coord: [-75.1652, 39.9526],
                date: { from: '2025-05-06', to: '2025-05-08' },
            },
            {
                name: 'Washington D.C.',
                nameId: 'washington-dc',
                description:
                    "As the political capital of the United States, it's home to the White House, the Capitol, and the Supreme Court—icons of democracy that shape the world. With the Smithsonian museums, stunning monuments, and cherry blossom-lined avenues, D.C. is a city that inspires both thought and awe. Whether you're walking the National Mall or discovering hidden gems in Georgetown, Washington D.C. is as enlightening as it is unforgettable.",
                coord: [-77.0369, 38.9072],
                date: { from: '2025-05-08', to: '2025-05-12' },
            },
        ],
        routeFileName: '2025-05-us',
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
            pmtilesName: '2025-04-de',
            maxBounds: [9.486131, 51.7356, 11.528907, 52.712054],
            maxZoom: 10,
            center: [10.523213, 52.264457],
            zoomLevel: {
                init: 9,
                focus: 10,
            },
        },
        locations: [
            {
                name: 'Braunschweig',
                nameId: 'braunschweig',
                description: LOREM_IPSUM,
                coord: [10.516667, 52.266666],
                date: { from: '2025-04-18' },
            },
            {
                name: 'Wolfsburg',
                nameId: 'wolfsburg',
                description: LOREM_IPSUM,
                coord: [10.7865, 52.4227],
                date: { from: '2025-04-19' },
            },
            {
                name: 'Wolfenbüttel',
                nameId: 'wolfenbuettel',
                description: LOREM_IPSUM,
                coord: [10.5342, 52.1604],
                date: { from: '2025-04-20' },
            },
        ],
        routeFileName: '2025-04-de',
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
            pmtilesName: '2024-11-it',
            maxBounds: [9.619174, 43.274784, 11.967384, 44.256538],
            maxZoom: 12,
            center: [10.85991, 43.720627],
            zoomLevel: {
                init: 9,
                focus: 11,
            },
        },
        locations: [
            {
                name: 'Pisa',
                nameId: 'pisa',
                description: LOREM_IPSUM,
                coord: [10.4018, 43.7228],
                date: { from: '2024-11-29', to: '2024-11-30' },
            },
            {
                name: 'Firenze',
                nameId: 'firenze',
                description: LOREM_IPSUM,
                coord: [11.2577, 43.77],
                date: { from: '2024-11-30', to: '2024-12-01' },
            },
        ],
        routeFileName: '2024-11-it.v2',
    },
];
