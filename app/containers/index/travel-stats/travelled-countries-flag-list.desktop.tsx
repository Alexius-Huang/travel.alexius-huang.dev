import type { FC } from 'react';
import type { CountryInfo } from '~/data-access/country';
import { CountryFlagChip } from '~/ui/country-flag-chip';
import { trim } from '~/utils/trim';

interface CountryFlagListProps {
    countries: Array<Pick<CountryInfo, 'countryCode' | 'name'>>;
    className?: string;
}

export const CountryFlagList: FC<CountryFlagListProps> = ({
    countries,
    className,
}) => (
    <ul
        className={trim`
        hidden sm:inline-grid gap-x-3.5 gap-y-2.5 mt-4
        w-[45%] md:w-[35%]
        grid-cols-[repeat(auto-fill,minmax(24px,1fr))]
        md:grid-cols-[repeat(auto-fill,minmax(32px,1fr))]
        lg:grid-cols-[repeat(auto-fill,minmax(40px,1fr))]
        ${className}
    `}
    >
        {countries.map(({ countryCode, name }) => (
            <li key={countryCode} className="text-gray-400 hover:text-gray-900">
                <CountryFlagChip
                    countryCode={countryCode}
                    name={name}
                    countryFlagIconClassName="size-5 md:size-7 lg:size-8"
                />
            </li>
        ))}
    </ul>
);
