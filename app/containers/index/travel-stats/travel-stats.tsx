import { /* useState, */ type FC } from 'react';
// import clsx from 'classnames';
import { TRAVELLED_COUNTRY_COUNT, TRAVELLED_COUNTRY_COUNT_BY_REGION, type CountryInfo, type WorldRegion } from '~/data-access/country';
import { IMG_BASE_URL } from '~/data-access/image-service';
import { CountryFlagIcon } from '~/icons/country/country';
// import { Button } from '~/components/button';
import { Tooltip } from '~/components/tooltip';
// import { ChevronDoubleDownOutlineIcon } from '~/icons/outline/chevron-double-down';
// import { ChevronDoubleUpOutlineIcon } from '~/icons/outline/chevron-double-up';
import { trim } from '~/utils/trim';
import './travel-stats.css';
import { TravelledCountriesCounter } from './travelled-countries-counter';

export interface TravelStatsProps {
    className?: string;
}

const asianRegions: Array<WorldRegion> = ['East Asia', 'Southeast Asia', 'South Asia', 'Central Asia', 'West Asia'];

function gatherRegions(regions: Array<WorldRegion>) {
    return regions.reduce((acc, region) => ({
        total: acc.total + TRAVELLED_COUNTRY_COUNT_BY_REGION[region].total,
        countries: [...acc.countries, ...TRAVELLED_COUNTRY_COUNT_BY_REGION[region].countries]
    }), { total: 0, countries: [] as Array<CountryInfo> });
}

const travelledAsianCountries = gatherRegions(asianRegions);
const travelledNorthCentralAmericanCountries = gatherRegions(['North America', 'Central America']);

export const TravelStats: FC<TravelStatsProps> = ({
    className
}) => {
    // const [expandedSections, setExpandedSections] = useState<Set<WorldRegion>>(new Set());


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
                    travel-stats__eu-bg
                    overflow-x-hidden
                    relative w-full
                    h-[300px] xs:h-[350px] md:h-[500px]
                    bg-cover bg-[right_-3.5rem_center] bg-no-repeat
                    xs:bg-contain xs:bg-[right_0rem_center]
                `}
                style={{
                    backgroundImage: `
                        url('${IMG_BASE_URL}/region/europe.v3.svg'
                    `
                }}
            >
                <div className={trim`
                    absolute top-[30%] sm:top-[2.5%] md:top-[12.5%] w-full
                    left-[5%] xs:left-[12%] sm:left-[7.5%] md:left-[5%]
                `}>
                    <TravelledCountriesCounter
                        count={TRAVELLED_COUNTRY_COUNT_BY_REGION['Europe'].total}
                        unitNode={<>
                            EUROPEAN
                            <br className='sm:hidden' />{' '}
                            COUNTRIES
                        </>}
                    />
                    {/* <h3 className={trim`
                        font-header text-xl xs:text-2xl sm:text-xl leading-tight
                    `}>
                        <span className='text-6xl xs:text-7xl sm:text-8xl font-bold text-blue-500'>
                            
                        </span>

                    </h3> */}

                    {/**
                      *  We show the country flags with tooltip on desktop version
                      *  only since there's enough space
                      */}
                    <ul className={trim`
                        hidden sm:inline-grid gap-x-3.5 gap-y-2.5 mt-4
                        w-[45%] md:w-[35%]
                        grid-cols-[repeat(auto-fill,minmax(24px,1fr))]
                        md:grid-cols-[repeat(auto-fill,minmax(32px,1fr))]
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
                                            className='rounded size-5 md:size-7'
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

            {/* TODO: Redesign Mobile View */}
            {/**
              *  For mobile view, since it is impossible to fit country flag list with the
              *  visited country banner section, the following populates a collapsable list
              *  of visited country info
              */}
            {/* <div className='px-4 pt-8 text-center bg-blue-500 text-white sm:hidden'>
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
            </div> */}

            <div
                className={trim`
                    travel-stats__asia-bg
                    relative w-full mt-16
                    h-[325px] xs:h-[325px] md:h-[500px]
                    bg-cover bg-[left_-9rem_center] bg-no-repeat
                    xs:bg-contain xs:bg-[left_-4.5rem_center]
                `}
                style={{
                    backgroundImage: `
                        url('${IMG_BASE_URL}/region/asia.svg'
                    `
                }}
            >
                <div className={trim`
                    absolute top-[30%] sm:top-[2.5%] md:top-[12.5%] w-full
                    right-[5%] xs:right-[12%] sm:right-[7.5%] md:right-[5%]
                    text-right
                `}>
                    <TravelledCountriesCounter
                        count={travelledAsianCountries.total}
                        unitNode={<>
                            ASIAN
                            <br className='sm:hidden' />{' '}
                            COUNTRIES
                        </>}
                    />

                    <ul className={trim`
                        hidden sm:inline-grid direction-rtl gap-x-3.5 gap-y-2.5 mt-4
                        w-[45%] md:w-[35%]
                        grid-cols-[repeat(auto-fill,minmax(24px,1fr))]
                        md:grid-cols-[repeat(auto-fill,minmax(32px,1fr))]
                    `}>
                        {travelledAsianCountries.countries.map(({
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
                                            className='rounded size-5 md:size-7'
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

            <div
                className={trim`
                    travel-stats__central-north-america-bg overflow-x-hidden
                    relative w-full mt-4
                    h-[300px] xs:h-[350px] md:h-[500px]
                    bg-cover bg-[right_-14rem_center] bg-no-repeat
                    xs:bg-contain xs:bg-[right_-8rem_center]
                `}
                style={{
                    backgroundImage: `
                        url('${IMG_BASE_URL}/region/central-north-america.v3.svg'
                    `
                }}
            >
                <div className={trim`
                    absolute top-[30%] sm:top-[2.5%] md:top-[12.5%] w-full
                    left-[5%] xs:left-[12%] sm:left-[7.5%] md:left-[5%]
                `}>
                    <TravelledCountriesCounter
                        count={travelledNorthCentralAmericanCountries.total}
                        unitNode={<>
                            CENTRAL NORTH
                            <br />{' '}
                            AMERICAN
                            <br className='xs:hidden' />{' '}
                            COUNTRIES
                        </>}
                    />
                    {/**
                      *  We show the country flags with tooltip on desktop version
                      *  only since there's enough space
                      */}
                    <ul className={trim`
                        hidden sm:inline-grid gap-x-3.5 gap-y-2.5 mt-4
                        w-[45%] md:w-[35%]
                        grid-cols-[repeat(auto-fill,minmax(24px,1fr))]
                        md:grid-cols-[repeat(auto-fill,minmax(32px,1fr))]
                    `}>
                        {travelledNorthCentralAmericanCountries.countries.map(({
                            countryCode,
                            name
                        }) => (
                            <li
                                key={countryCode}
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
                                            className='rounded size-5 md:size-7'
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

            <div
                className={trim`
                    travel-stats__africa-bg
                    relative w-full mt-10
                    h-[375px] xs:h-[425px] md:h-[500px]
                    bg-cover bg-[left_-6rem_center] bg-no-repeat
                    xs:bg-contain xs:bg-[left_-2rem_center]
                `}
                style={{
                    backgroundImage: `
                        url('${IMG_BASE_URL}/region/africa.svg'
                    `
                }}
            >
                <div className={trim`
                    absolute top-[30%] sm:top-[2.5%] md:top-[12.5%] w-full
                    right-[5%] xs:right-[12%] sm:right-[7.5%] md:right-[5%]
                    text-right
                `}>
                    <TravelledCountriesCounter
                        count={TRAVELLED_COUNTRY_COUNT_BY_REGION['Africa'].total}
                        unitNode={<>
                            AFRICAN
                            <br className='sm:hidden' />{' '}
                            COUNTRIES
                        </>}
                    />
                    <ul className={trim`
                        hidden sm:inline-grid direction-rtl gap-x-3.5 gap-y-2.5 mt-4
                        w-[45%] md:w-[35%]
                        grid-cols-[repeat(auto-fill,minmax(24px,1fr))]
                        md:grid-cols-[repeat(auto-fill,minmax(32px,1fr))]
                    `}>
                        {TRAVELLED_COUNTRY_COUNT_BY_REGION['Africa'].countries.map(({
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
                                            className='rounded size-5 md:size-7'
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
        </section>
    );
};
