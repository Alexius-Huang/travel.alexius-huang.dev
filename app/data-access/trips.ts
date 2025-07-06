import type { DateFormat } from "./date";

/**
 *  In the future, we would need to move this to database
 */
export interface TripDetails {
    title: string;
    subtitle: string;
    description: string;
    tags?: Array<string>;
    countryCodes: Array<string>;
    date: { from: DateFormat; to: DateFormat };
}

export const TRIPS: Array<TripDetails> = [
    {
        title: "E Pluribus Unum - Three Cities, One Nation's Legacy",
        subtitle: "Tracing America's roots through its political and financial heartlands",
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['US East Coast', 'Long Trip', 'Capital Tour', 'Metropolis', 'New York', 'Washington D.C.', 'Pennsylvania'],
        countryCodes: ['us'],
        date: { from: '2025-04-30', to: '2025-05-12' }
    },
    {
        title: 'Of Cobblestones & Steel',
        subtitle: "A Mellow Meander From Medieval Alleys to Automotive Heartland in Lower Saxony",
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['Lower Saxony', 'Medieval Town', 'Industry'],
        countryCodes: ['de'],
        date: { from: '2025-04-18', to: '2025-04-20' }        
    },
    {
        title: 'Tuscan Whispers',
        subtitle: "From the Leaning Tower to Brunelleschi's Dome, Explore The Heart of The Renaissance",
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['Renaissance', 'Art', 'UNESCO Heritage'],
        countryCodes: ['it'],
        date: { from: '2024-11-29', to: '2024-12-02' }
    },
];
