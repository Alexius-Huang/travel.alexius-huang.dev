import type { FC } from 'react';
import { TRAVELLED_COUNTRY_COUNT, TRAVELLED_COUNTRY_COUNT_BY_REGION } from '~/data-access/country';
import { IMG_BASE_URL } from '~/data-access/image-service';
import { CountryFlagIcon } from '~/icons/country/country';

export interface TravelStatsProps {
    className?: string;
}

export const TravelStats: FC<TravelStatsProps> = ({
    className
}) => {
    return (
        <section className={className}>
            <h2 className='
                font-bold text-2xl text-center
                py-12
            '>
                <span
                    className='block text-9xl text-blue-500'
                >{TRAVELLED_COUNTRY_COUNT}</span>{' '}
                COUNTRIES TRAVELLED
            </h2>

            <div
                className='relative w-full h-[300px] bg-cover'
                style={{
                    backgroundImage: `url('${IMG_BASE_URL}/region/europe.v2.svg')`
                }}
            >
                <p className='
                    absolute top-[25%] left-[5%] my-auto
                    font-header text-xl leading-tight
                '>
                    <span className='text-6xl font-bold text-blue-500'>
                        {TRAVELLED_COUNTRY_COUNT_BY_REGION['Europe'].total}
                    </span>

                    <br />
                    EUROPEAN
                    <br />
                    COUNTRIES
                </p>
            </div>

            <ul className='
                grid gap-x-4 gap-y-6
                grid-cols-[repeat(auto-fit,minmax(100px,1fr))]
                md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]
                text-white px-6 py-12 text-center
                bg-blue-500
            '>
                {TRAVELLED_COUNTRY_COUNT_BY_REGION['Europe'].countries.map(({
                    countryCode,
                    fullname,
                    name
                }) => (
                    <li key={countryCode}>
                        <span className='inline-block'>
                        <CountryFlagIcon
                            countryCode={countryCode}
                            size='md'
                            className='rounded'
                        />
                        </span>

                        <p className='font-header font-bold text-sm'>
                            {name}
                        </p>
                        <p className='text-xs text-white/70 text-balance'>
                            {fullname}
                        </p>
                    </li>
                ))}
            </ul>

            {/* TODO: Handle Desktop View Media Query */}
            {/* TODO: Show More on over 9 countries in mobile mode */}
            {/* TODO: Show North America, Asia & Africa */}
        </section>
    );
};
