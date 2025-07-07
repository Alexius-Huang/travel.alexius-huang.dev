import { useState, type FC } from 'react';
import { Button } from '~/components/button';
import { MapPinOutlineIcon } from '~/icons/outline/map-pin';
import { CalendarDateRangeOutlineIcon } from '~/icons/outline/calendar-date-range';
import { CountryFlagIcon } from '~/icons/country/country';
import { BannerConfig } from './consts';
import { trim } from '~/utils/trim';

const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
});

function formatDate(date: string) {
    return formatter.format(new Date(date));
}

export const TravelHighlight: FC<{ className?: string }> = ({ className }) => {
    const [index, setIndex] = useState(0);

    return (
        <div className={className}>
            <section className="desktop-only-block">
                <div
                    className={trim`
                        relative w-100% h-[100vh] sm:h-[720px] xl:h-[100vh] xl:max-h-[960px]
                        bg-cover bg-no-repeat
                    `}
                    style={{
                        backgroundImage: `url(${BannerConfig[index].desktop})`,
                    }}
                >
                    <h1
                        className="
                            absolute left-4 z-2
                            bottom-[-0.75rem] sm:bottom-[-1.5rem]
                            sm:text-8xl md:text-9xl
                            text-white font-bold"
                    >
                        {BannerConfig[index].title}
                    </h1>
                </div>

                <div className="px-6 mt-6 w-[500px] flex flex-col gap-3">
                    <p className="flex items-center gap-2 text-sm font-bold">
                        <MapPinOutlineIcon size="sm" />{' '}
                        {BannerConfig[index].location}
                        <CountryFlagIcon
                            countryCode={BannerConfig[index].countryCode}
                            size="sm"
                            className="rounded"
                        />
                    </p>
                    <p className="flex items-center gap-2 text-sm font-bold">
                        <CalendarDateRangeOutlineIcon size="sm" />{' '}
                        {formatDate(BannerConfig[index].date.from)}
                    </p>

                    <p className="py-2 px-4">
                        {BannerConfig[index].description}
                    </p>

                    <div>
                        <Button size="sm">Explore More (To Be Updated)</Button>
                    </div>
                </div>
            </section>

            <section
                className="
                        mobile-only-block relative z-0
                        w-screen h-screen bg-cover bg-center bg-no-repeat
                    "
                style={{
                    backgroundImage: `url(${BannerConfig[index].mobile})`,
                }}
            >
                <div
                    className="
                         absolute top-10 left-0 right-0 my-0 mx-auto"
                >
                    <h1
                        className="
                            text-5xl xs:text-6xl font-bold text-white text-center
                        "
                    >
                        {BannerConfig[index].title}
                    </h1>

                    <p className="mt-1.5 text-xs xs:text-sm px-4 text-center text-white">
                        {BannerConfig[index].description}
                    </p>
                </div>

                <div
                    className="
                        px-1.5 py-2.5 flex flex-col gap-2
                        absolute bottom-1 left-1 rounded text-white dark:text-white
                    "
                >
                    <p className="flex items-center gap-2 text-xs font-bold">
                        <MapPinOutlineIcon size="sm" />{' '}
                        {BannerConfig[index].location}
                        <CountryFlagIcon
                            countryCode={BannerConfig[index].countryCode}
                            size="sm"
                            className="rounded"
                        />
                    </p>
                    <p className="flex items-center gap-2 text-xs font-bold">
                        <CalendarDateRangeOutlineIcon size="sm" />{' '}
                        {formatDate(BannerConfig[index].date.from)}
                    </p>

                    <div>
                        <Button size="xs">Explore More (To Be Updated)</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
