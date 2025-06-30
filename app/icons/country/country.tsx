import type { ComponentProps, FC } from 'react';
import type { IconProps } from '../type';
import loadable, { type LoadableComponent } from '@loadable/component';
import { FallbackCountryIcon } from './_fallback';

export const COUNTRY_FLAG_ICON_MAPPING: Record<string, LoadableComponent<IconProps>> = {
    us: loadable(() => import('./_us').then(m => m.USFlagIcon)),
    de: loadable(() => import('./_de').then(m => m.GermanyFlagIcon)),
    fr: loadable(() => import('./_fr').then(m => m.FranceFlagIcon)),
    es: loadable(() => import('./_es').then(m => m.SpainFlagIcon)),
    it: loadable(() => import('./_it').then(m => m.ItalyFlagIcon)),
    va: loadable(() => import('./_va').then(m => m.VaticanFlagIcon)),
    gb: loadable(() => import('./_gb').then(m => m.UKFlagIcon)),
    se: loadable(() => import('./_se').then(m => m.SwedenFlagIcon)),
    dk: loadable(() => import('./_dk').then(m => m.DenmarkFlagIcon)),
    fi: loadable(() => import('./_fi').then(m => m.FinlandFlagIcon)),
    lv: loadable(() => import('./_lv').then(m => m.LatviaFlagIcon)),
    lt: loadable(() => import('./_lt').then(m => m.LithuaniaFlagIcon)),
    at: loadable(() => import('./_at').then(m => m.AustriaFlagIcon)),
    sk: loadable(() => import('./_sk').then(m => m.SlovakiaFlagIcon)),
    hu: loadable(() => import('./_hu').then(m => m.HungaryFlagIcon)),
    gr: loadable(() => import('./_gr').then(m => m.GreeceFlagIcon)),
    tr: loadable(() => import('./_tr').then(m => m.TurkeyFlagIcon)),
    hr: loadable(() => import('./_hr').then(m => m.CroatiaFlagIcon)),
    me: loadable(() => import('./_me').then(m => m.MontenegroFlagIcon)),
    al: loadable(() => import('./_al').then(m => m.AlbaniaFlagIcon)),
    ba: loadable(() => import('./_ba').then(m => m.BosniaAndHerzegovinaFlagIcon)),
    in: loadable(() => import('./_in').then(m => m.IndiaFlagIcon)),
    eg: loadable(() => import('./_eg').then(m => m.EgyptFlagIcon)),
};

type LoadableProps = ComponentProps<LoadableComponent<IconProps>>;
export interface CountryFlagIconProps extends IconProps, LoadableProps {
    countryCode: string;
}

export const CountryFlagIcon: FC<CountryFlagIconProps> = ({
    countryCode,
    className,
    size,
    /* TODO: Provide proper flag fallback icon! */
    fallback = <FallbackCountryIcon className={className} size={size} />,
    ...loadableProps
}) => {
    const CountryFlag = COUNTRY_FLAG_ICON_MAPPING[countryCode];

    if (!CountryFlag) {
        throw new Error(`Country flag icon for "${countryCode}" not found.`);
    }

    return <CountryFlag
        fallback={fallback}
        className={`shadow-sm shadow-gray-400 dark:shadow-emerald-500 ${className}`}
        size={size}
        {...loadableProps}
    />;
};
