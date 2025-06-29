import type { FC } from 'react';
import { Tooltip } from '~/components/tooltip';
import type { CountryInfo } from '~/data-access/country';
import { CountryFlagIcon } from '~/icons/country/country';

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
