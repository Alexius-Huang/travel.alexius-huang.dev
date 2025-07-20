import { type FC } from 'react';
import {
    TRAVELLED_COUNTRY_COUNT,
    TRAVELLED_COUNTRY_COUNT_BY_REGION,
    type CountryInfo,
    type WorldRegion,
} from '~/data-access/country';
import { trim } from '~/utils/trim';
import { TravelledCountriesCounter } from './travelled-countries-counter';
import { CountryFlagList } from './travelled-countries-flag-list';
import { RegionBackgroundWrapper } from './region-background-wrapper';
import './travel-stats.css';
import { TravelledCountriesModal } from './travelled-countries-modal';

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
                <CountryFlagList
                    className="travel-stats__country-flag-list"
                    countries={
                        TRAVELLED_COUNTRY_COUNT_BY_REGION['Europe'].countries
                    }
                />
                <TravelledCountriesModal
                    countries={
                        TRAVELLED_COUNTRY_COUNT_BY_REGION['Europe'].countries
                    }
                    regionName='Central North American'
                />
            </RegionBackgroundWrapper>

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
                    className="direction-rtl travel-stats__country-flag-list"
                />
                <TravelledCountriesModal
                    countries={travelledAsianCountries.countries}
                    regionName='Asian'
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
                    className="travel-stats__country-flag-list"
                    countries={travelledNorthCentralAmericanCountries.countries}
                />
                <TravelledCountriesModal
                    countries={travelledNorthCentralAmericanCountries.countries}
                    regionName='Central North American'
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
                    className="direction-rtl travel-stats__country-flag-list"
                />
                <TravelledCountriesModal
                    countries={
                        TRAVELLED_COUNTRY_COUNT_BY_REGION['Africa'].countries
                    }
                    regionName='African'
                />
            </RegionBackgroundWrapper>
        </section>
    );
};
