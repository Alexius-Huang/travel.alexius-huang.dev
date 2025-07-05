import type { FC } from 'react';
import { Tooltip } from '~/components/tooltip';
import {
    CountryFlagIcon,
    type CountryFlagIconProps,
} from '~/icons/country/country';
import { trim } from '~/utils/trim';

interface CountryFlagChip {
    className?: string;
    countryFlagIconClassName?: string;
    countryCode: string;
    name: string;
    onClick?: (countryCode: string) => void;
    size?: CountryFlagIconProps['size'];
    variant?: 'vertical' | 'horizontal';
}

export const CountryFlagChip: FC<CountryFlagChip> = ({
    className,
    countryFlagIconClassName = '',
    countryCode,
    name,
    onClick,
    size = 'md',
    variant = 'vertical',
}) => {
    return (
        <Tooltip
            key={countryCode}
            triggerButtonProps={{
                className: '!px-0.5 !py-0.5',
                variant: 'tertiary',
            }}
            tooltip={<p className="text-sm text-center">{name}</p>}
        >
            <div
                className={trim`
                    flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} items-center
                    ${variant === 'horizontal' ? 'gap-x-2' : ''}
                    ${className}
                `}
                onClick={() => onClick?.(countryCode)}
            >
                <CountryFlagIcon
                    countryCode={countryCode}
                    size={size}
                    className={`rounded ${countryFlagIconClassName}`}
                />
                <p className="text-xs text-center uppercase font-header mt-0.5">
                    {countryCode}
                </p>
            </div>
        </Tooltip>
    );
};
