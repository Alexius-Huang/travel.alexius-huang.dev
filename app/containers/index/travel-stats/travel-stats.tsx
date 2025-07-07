import { /* useState, */ type FC } from 'react';
// import clsx from 'classnames';
import {
    TRAVELLED_COUNTRY_COUNT,
    TRAVELLED_COUNTRY_COUNT_BY_REGION,
    type CountryInfo,
    type WorldRegion,
} from '~/data-access/country';
// import { Button } from '~/components/button';
// import { ChevronDoubleDownOutlineIcon } from '~/icons/outline/chevron-double-down';
// import { ChevronDoubleUpOutlineIcon } from '~/icons/outline/chevron-double-up';
import { trim } from '~/utils/trim';
import { TravelledCountriesCounter } from './travelled-countries-counter';
import { CountryFlagList } from './travelled-countries-flag-list.desktop';
import { RegionBackgroundWrapper } from './region-background-wrapper';
import './travel-stats.css';

export interface TravelStatsProps {
    className?: string;
}

const asianRegions: Array<WorldRegion> = [
    'East Asia',
    'Southeast Asia',
    'South Asia',
    'Central Asia',
    'West Asia',
];

function gatherRegions(regions: Array<WorldRegion>) {
    return regions.reduce(
        (acc, region) => ({
            total: acc.total + TRAVELLED_COUNTRY_COUNT_BY_REGION[region].total,
            countries: [
                ...acc.countries,
                ...TRAVELLED_COUNTRY_COUNT_BY_REGION[region].countries,
            ],
        }),
        { total: 0, countries: [] as Array<CountryInfo> },
    );
}

const travelledAsianCountries = gatherRegions(asianRegions);
const travelledNorthCentralAmericanCountries = gatherRegions([
    'North America',
    'Central America',
]);

export const TravelStats: FC<TravelStatsProps> = ({ className }) => {
    // const [expandedSections, setExpandedSections] = useState<Set<WorldRegion>>(new Set());

    return (
        <section className={className}>
            <h2
                className={trim`
                    text-2xl md:text-3xl text-center
                    py-12 mb-6
                `}
            >
                <span className="block font-bold text-9xl md:text-[10rem] text-blue-500">
                    {TRAVELLED_COUNTRY_COUNT}
                </span>{' '}
                COUNTRIES TRAVELLED
            </h2>

            <RegionBackgroundWrapper
                className="travel-stats__bg travel-stats__eu-bg"
                backgroundImageURL="region/europe.v3.svg"
            >
                <TravelledCountriesCounter
                    count={TRAVELLED_COUNTRY_COUNT_BY_REGION['Europe'].total}
                    unitNode={
                        <>
                            EUROPEAN
                            <br className="sm:hidden" /> COUNTRIES
                        </>
                    }
                />
                {/**
                 *  We show the country flags with tooltip on desktop version
                 *  only since there's enough space
                 */}

                <CountryFlagList
                    countries={
                        TRAVELLED_COUNTRY_COUNT_BY_REGION['Europe'].countries
                    }
                />
            </RegionBackgroundWrapper>

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
                            <p className='text-xs text-white/70'>
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

            <RegionBackgroundWrapper
                className="travel-stats__bg travel-stats__asia-bg"
                backgroundImageURL="region/asia.svg"
            >
                <TravelledCountriesCounter
                    count={travelledAsianCountries.total}
                    unitNode={
                        <>
                            ASIAN
                            <br className="sm:hidden" /> COUNTRIES
                        </>
                    }
                />
                <CountryFlagList
                    countries={travelledAsianCountries.countries}
                    className="direction-rtl"
                />
            </RegionBackgroundWrapper>

            <RegionBackgroundWrapper
                className="travel-stats__bg travel-stats__central-north-america-bg"
                backgroundImageURL="region/central-north-america.v3.svg"
            >
                <TravelledCountriesCounter
                    count={travelledNorthCentralAmericanCountries.total}
                    unitNode={
                        <>
                            CENTRAL NORTH
                            <br /> AMERICAN
                            <br className="sm:hidden" /> COUNTRIES
                        </>
                    }
                />
                <CountryFlagList
                    countries={travelledNorthCentralAmericanCountries.countries}
                />
            </RegionBackgroundWrapper>

            <RegionBackgroundWrapper
                className="travel-stats__bg travel-stats__africa-bg"
                backgroundImageURL="region/africa.svg"
            >
                <TravelledCountriesCounter
                    count={TRAVELLED_COUNTRY_COUNT_BY_REGION['Africa'].total}
                    unitNode={
                        <>
                            AFRICAN
                            <br className="sm:hidden" /> COUNTRIES
                        </>
                    }
                />
                <CountryFlagList
                    countries={
                        TRAVELLED_COUNTRY_COUNT_BY_REGION['Africa'].countries
                    }
                    className="direction-rtl"
                />
            </RegionBackgroundWrapper>
        </section>
    );
};
