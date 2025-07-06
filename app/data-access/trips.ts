import type { DateFormat } from "./date";

/**
 *  In the future, we would need to move this to database
 */
export interface TripDetails {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    tags?: Array<string>;
    countryCodes: Array<string>;
    date: { from: DateFormat; to: DateFormat };
}

export const TRIPS: Array<TripDetails> = [
    {
        id: 1,
        title: "E Pluribus Unum",
        subtitle: "Tracing America's roots through its political and financial heartlands",
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['US East Coast', 'Long Trip', 'Capital Tour', 'Metropolis', 'New York', 'Washington D.C.', 'Pennsylvania'],
        countryCodes: ['us'],
        date: { from: '2025-04-30', to: '2025-05-12' }
    },
    {
        id: 2,
        title: 'Of Cobblestones & Steel',
        subtitle: "A Mellow Meander From Medieval Alleys to Automotive Heartland in Lower Saxony",
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['Lower Saxony', 'Medieval Town', 'Industry', 'Short Trip'],
        countryCodes: ['de'],
        date: { from: '2025-04-18', to: '2025-04-20' }        
    },
    {
        id: 3,
        title: 'Tuscan Whispers',
        subtitle: "From the Leaning Tower to Brunelleschi's Dome, Explore The Heart of The Renaissance",
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['Renaissance', 'Art', 'UNESCO Heritage', 'Short Trip'],
        countryCodes: ['it'],
        date: { from: '2024-11-29', to: '2024-12-02' }
    },
];
