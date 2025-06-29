import { useState, type FC } from 'react';
import clsx from 'classnames';
import { TRAVELLED_COUNTRY_COUNT, TRAVELLED_COUNTRY_COUNT_BY_REGION, type WorldRegion } from '~/data-access/country';
import { IMG_BASE_URL } from '~/data-access/image-service';
import { CountryFlagIcon } from '~/icons/country/country';
import { Button } from '~/components/button';
import { Tooltip } from '~/components/tooltip';
import { ChevronDoubleDownOutlineIcon } from '~/icons/outline/chevron-double-down';
import { ChevronDoubleUpOutlineIcon } from '~/icons/outline/chevron-double-up';
import './travel-stats.css';
import { trim } from '~/utils/trim';
import { TooltipTrigger } from 'react-aria-components';

export interface TravelStatsProps {
    className?: string;
}

export const TravelStats: FC<TravelStatsProps> = ({
    className
}) => {
    const [expandedSections, setExpandedSections] = useState<Set<WorldRegion>>(new Set());

    return (
        <section className={className}>
            <h2 className={trim`
                text-2xl md:text-3xl text-center
                py-12 mb-6
            `}>
                <span
                    className='block font-bold text-9xl md:text-[10rem] text-blue-500'
                >{TRAVELLED_COUNTRY_COUNT}</span>{' '}
                COUNTRIES TRAVELLED
            </h2>

            <div
                className={trim`
                    relative w-full
                    h-[225px] xs:h-[325px] md:h-[500px]
                    bg-cover bg-[right_-2rem_center] bg-no-repeat
                    xs:bg-contain xs:bg-[right_-5rem_center]
                `}
                style={{
                    backgroundImage: `url('${IMG_BASE_URL}/region/europe.v2.svg')`
                }}
            >
                <div className={trim`
                    absolute top-[25%] md:top-[12.5%] w-full
                    left-[5%] xs:left-[12%] md:left-[5%]
                `}>
                    <h3 className={trim`
                        font-header text-xl md:text-2xl leading-tight
                    `}>
                        <span className='text-6xl md:text-8xl font-bold text-blue-500'>
                            {TRAVELLED_COUNTRY_COUNT_BY_REGION['Europe'].total}
                        </span>

                        <br />
                        EUROPEAN
                        <br />
                        COUNTRIES
                    </h3>

                    {/**
                      *  We show the country flags tooltip on desktop version only
                      *  since there's enough space
                      */}
                    <ul className={trim`
                        hidden md:grid gap-x-3.5 gap-y-2.5 mt-4 w-[35%]
                        grid-cols-[repeat(auto-fit,minmax(32px,1fr))]
                    `}>
                        {TRAVELLED_COUNTRY_COUNT_BY_REGION['Europe'].countries.map(({
                            countryCode,
                            name
                        }) => (
                            <li
                                key={countryCode}
                                // todo: convert using CSS class!
                                className={trim`
                                    text-gray-400 hover:text-gray-900
                                `}
                            >
                                <Tooltip
                                    key={countryCode}
                                    triggerButtonProps={{
                                        className: '!px-0.5 !py-0.5',
                                        variant: 'tertiary'
                                    }}
                                    tooltip={
                                        <p className='text-sm text-balance text-center'>
                                            {name}
                                        </p>
                                    }
                                >
                                    <div className='flex flex-col'>
                                        <CountryFlagIcon
                                            countryCode={countryCode}
                                            size='xl'
                                            className='rounded'
                                        />
                                        <p className={trim`
                                            text-xs text-center uppercase font-header mt-0.5
                                        `}>
                                            {countryCode}
                                        </p>
                                    </div>
                                </Tooltip>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/**
              *  For mobile view, since it is impossible to fit country flag list with the
              *  visited country banner section, the following populates a collapsable list
              *  of visited country info
              */}
            <div className='px-4 pt-8 text-center bg-blue-500 text-white md:hidden'>
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
