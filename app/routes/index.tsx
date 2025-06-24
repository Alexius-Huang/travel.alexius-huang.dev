import { json } from '~/utils/response.server';
import type { Route } from './+types/index';
import { useState } from 'react';
import { Button } from '~/components/button';
import { MapPinOutlineIcon } from '~/icons/outline/map-pin';
import { CalendarDateRangeOutlineIcon } from '~/icons/outline/calendar-date-range';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Travel | Alexius Huang' },
        { name: 'description', content: "Alexius's Personal Travel Blog" },
    ];
}

interface LoaderData {}
export async function loader(_: Route.LoaderArgs) {
    return json<LoaderData>({});
}

const imageBaseUrl = 'https://images.alexius-huang.dev';
const BannerConfig = [
    {
        title: 'SANTORINI',
        location: 'Santorini, Greece',
        description:
            'Everywhere with whitewashed villages, sapphire domes and one of the most beautiful sunsets in the world.',
        date: { from: '2024-05-04', to: '2024-05-06' },
        desktop: `${imageBaseUrl}/highlight/gr-oia-landscape.webp`,
        desktopAlt: 'Sunset at Oia, Santorini at May of 2024',
        mobile: `${imageBaseUrl}/highlight/gr-santorini-vert-2.webp`,
        mobileAlt: 'Santorini trip at May of 2024',
    },
    {
        title: 'GIZA',
        location: 'Giza, Egypt',
        description:
            'Timeless symbol of ancient Egypt with legendary Pyramids and the Great Sphinx.',
        date: { from: '2024-09-24' },
        desktop: `${imageBaseUrl}/highlight/egp-gize-landscape.webp`,
        desktopAlt: 'Giza Pyramids at September of 2024',
        mobile: `${imageBaseUrl}/highlight/egp-gize-vert.webp`,
        mobileAlt: 'The Great Sphinx of Giza at September of 2024',
    },
];

const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
});

function formatDate(date: string) {
    return formatter.format(new Date(date));
}

export default function Home() {
    /* const {} = useLoaderData<LoaderData>(); */
    const [index, setIndex] = useState(0);

    return (
        <div className="h-screen overflow-y-scroll pb-[300px]">
            <div className="my-0 mx-auto max-w-[960px]">
                <section>
                    <div className="relative w-100%">
                        <img
                            width={960}
                            height={720}
                            src={BannerConfig[index].desktop}
                            alt={BannerConfig[index].desktopAlt}
                        />

                        <h1 className="absolute left-4 bottom-[-1.5rem] text-9xl text-white font-bold">
                            {BannerConfig[index].title}
                        </h1>
                    </div>

                    <div className="px-6 mt-6 w-[500px] flex flex-col gap-3">
                        <p className="flex items-center gap-2 text-sm font-bold">
                            <MapPinOutlineIcon size="sm" />{' '}
                            {BannerConfig[index].location}
                        </p>
                        <p className="flex items-center gap-2 text-sm font-bold">
                            <CalendarDateRangeOutlineIcon size="sm" />{' '}
                            {formatDate(BannerConfig[index].date.from)}
                        </p>

                        <p className="py-2 px-4">
                            {BannerConfig[index].description}
                        </p>

                        <div>
                            <Button size="sm">
                                Explore More (To Be Updated)
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
