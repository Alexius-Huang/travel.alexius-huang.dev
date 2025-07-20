import type { FC } from 'react';
import type { CountryInfo } from '~/data-access/country';
import { CountryFlagChip } from '~/ui/country-flag-chip';

interface CountryFlagListProps {
    countries: Array<Pick<CountryInfo, 'countryCode' | 'name'>>;
    className?: string;
}

export const CountryFlagList: FC<CountryFlagListProps> = ({
    countries,
    className,
}) => {
    return (
        <div>
            <ul className={`mt-4 w-[35%] sm:w-[45%] md:w-[35%] ${className}`}>
                {countries.map(({ countryCode, name }) => (
                    <li
                        key={countryCode}
                        className="text-gray-400 hover:text-gray-900"
                    >
                        <CountryFlagChip
                            countryCode={countryCode}
                            name={name}
                            countryFlagIconClassName="size-5 md:size-7 lg:size-8"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
