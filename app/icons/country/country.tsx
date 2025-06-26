import type { FC } from 'react';
import type { IconProps } from '../type';
import { USFlagIcon } from './_us';
import { GermanyFlagIcon } from './_de';
import { FranceFlagIcon } from './_fr';
import { SpainFlagIcon } from './_es';
import { ItalyFlagIcon } from './_it';
import { VaticanFlagIcon } from './_va';
import { UKFlagIcon } from './_gb';
import { SwedenFlagIcon } from './_se';
import { DenmarkFlagIcon } from './_dk';
import { FinlandFlagIcon } from './_fi';
import { LatviaFlagIcon } from './_lv';
import { LithuaniaFlagIcon } from './_lt';
import { AustriaFlagIcon } from './_at';
import { SlovakiaFlagIcon } from './_sk';
import { HungaryFlagIcon } from './_hu';
import { GreeceFlagIcon } from './_gr';
import { TurkeyFlagIcon } from './_tr';
import { CroatiaFlagIcon } from './_hr';
import { MontenegroFlagIcon } from './_me';
import { AlbaniaFlagIcon } from './_al';
import { BosniaAndHerzegovinaFlagIcon } from './_ba';
import { IndiaFlagIcon } from './_in';
import { EgyptFlagIcon } from './_eg';

export const flagIconMapping: Record<string, FC<IconProps>> = {
    us: USFlagIcon,
    de: GermanyFlagIcon,
    fr: FranceFlagIcon,
    es: SpainFlagIcon,
    it: ItalyFlagIcon,
    va: VaticanFlagIcon,
    gb: UKFlagIcon,
    se: SwedenFlagIcon,
    dk: DenmarkFlagIcon,
    fi: FinlandFlagIcon,
    lv: LatviaFlagIcon,
    lt: LithuaniaFlagIcon,
    at: AustriaFlagIcon,
    sk: SlovakiaFlagIcon,
    hu: HungaryFlagIcon,
    gr: GreeceFlagIcon,
    tr: TurkeyFlagIcon,
    hr: CroatiaFlagIcon,
    me: MontenegroFlagIcon,
    al: AlbaniaFlagIcon,
    ba: BosniaAndHerzegovinaFlagIcon,
    in: IndiaFlagIcon,
    eg: EgyptFlagIcon,
};
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
