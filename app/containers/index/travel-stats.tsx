import { useState, type FC } from 'react';
import clsx from 'classnames';
import { TRAVELLED_COUNTRY_COUNT, TRAVELLED_COUNTRY_COUNT_BY_REGION, type WorldRegion } from '~/data-access/country';
import { IMG_BASE_URL } from '~/data-access/image-service';
import { CountryFlagIcon } from '~/icons/country/country';
import { Button } from '~/components/button';
import { ChevronDoubleDownOutlineIcon } from '~/icons/outline/chevron-double-down';
import { ChevronDoubleUpOutlineIcon } from '~/icons/outline/chevron-double-up';
import './travel-stats.css';

export interface TravelStatsProps {
    className?: string;
}

export const TravelStats: FC<TravelStatsProps> = ({
    className
}) => {
    const [expandedSections, setExpandedSections] = useState<Set<WorldRegion>>(new Set());

    return (
        <section className={className}>
            <h2 className='
                font-bold text-2xl text-center
                py-12 mb-6
            '>
                <span
                    className='block text-9xl text-blue-500'
                >{TRAVELLED_COUNTRY_COUNT}</span>{' '}
                COUNTRIES TRAVELLED
            </h2>

            <div
                className='
                    relative w-full
                    h-[225px] xs:h-[325px] md:h-[500px]
                    bg-cover bg-[right_-2rem_center] bg-no-repeat xs:bg-contain xs:bg-right'
                style={{
                    backgroundImage: `url('${IMG_BASE_URL}/region/europe.v2.svg')`
                }}
            >
                <p className='
                    absolute top-[25%]
                    left-[5%] xs:left-[12%]
                    my-auto font-header text-xl leading-tight
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

            <div className='px-4 pt-8 text-center bg-blue-500 text-white'>
                <ul className={clsx(
                    'travel-stats__country-list',
                    { 'travel-stats__country-list--expanded': expandedSections.has('Europe') }
                )}>
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

                <Button
                    size='sm'
                    variant='tertiary'
                    startIcon={expandedSections.has('Europe') ? ChevronDoubleUpOutlineIcon : ChevronDoubleDownOutlineIcon}
                    endIcon={expandedSections.has('Europe') ? ChevronDoubleUpOutlineIcon : ChevronDoubleDownOutlineIcon}
                    className='!text-white w-[calc(100%+2rem)] justify-center ml-[-1rem] !bg-blue-400/40'
                    onClick={() => {
                        const updated = new Set(expandedSections);
                        if (updated.has('Europe')) {
                            updated.delete('Europe');
                        } else {
                            updated.add('Europe');
                        }

                        setExpandedSections(updated);
                    }}
                >
                    {expandedSections.has('Europe') ? 'COLLAPSE' : 'EXPAND MORE'}
                </Button>
            </div>
            {/* TODO: Handle Desktop View Media Query */}
            {/* TODO: Show North America, Asia & Africa */}
        </section>
    );
};
