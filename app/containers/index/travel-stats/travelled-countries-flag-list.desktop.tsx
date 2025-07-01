import type { FC } from 'react';
import { Tooltip } from '~/components/tooltip';
import type { CountryInfo } from '~/data-access/country';
import { CountryFlagIcon } from '~/icons/country/country';
import { trim } from '~/utils/trim';

interface CountryFlagListItemProps
    extends Pick<CountryInfo, 'countryCode' | 'name'> {}

export const CountryFlagListItem: FC<CountryFlagListItemProps> = ({
    countryCode,
    name,
}) => (
    <li key={countryCode} className="text-gray-400 hover:text-gray-900">
        <Tooltip
            key={countryCode}
            triggerButtonProps={{
                className: '!px-0.5 !py-0.5',
                variant: 'tertiary',
            }}
            tooltip={<p className="text-sm text-balance text-center">{name}</p>}
        >
            <div className="flex flex-col">
                <CountryFlagIcon
                    countryCode={countryCode}
                    className="rounded size-5 md:size-7"
                />
                <p className="text-xs text-center uppercase font-header mt-0.5">
                    {countryCode}
                </p>
            </div>
        </Tooltip>
    </li>
);

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
        ${className}
    `}
    >
        {countries.map((info) => (
            <CountryFlagListItem key={info.countryCode} {...info} />
        ))}
    </ul>
);
