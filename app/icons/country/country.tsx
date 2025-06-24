import type { FC, JSX } from 'react';
import type { IconProps } from '../type';
import { EgyptFlagIcon } from './_eg';
import { GreeceFlagIcon } from './_gr';

const mapping: Record<string, FC<IconProps>> = {
    eg: EgyptFlagIcon,
    gr: GreeceFlagIcon,
};

export interface CountryFlagIconProps extends IconProps {
    countryCode: string;
}

export const CountryFlagIcon: FC<CountryFlagIconProps> = ({
    countryCode,
    ...iconProps
}) => {
    const CountryFlag = mapping[countryCode];

    if (!CountryFlag) {
        throw new Error(`Country flag icon for "${countryCode}" not found.`);
    }

    return <CountryFlag {...iconProps} />;
};
