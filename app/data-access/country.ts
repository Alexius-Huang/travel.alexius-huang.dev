export type WorldRegion =
    | 'North America'
    | 'South America'
    | 'Central America'
    | 'Caribbean'
    | 'Asia'
    | 'Africa'
    | 'Europe'
    | 'Oceania';

export interface CountryInfo {
    name: string;
    fullname: string;
    fullnameTranslation?: string;
    aliases?: Array<string>;
    countryCode: string;
    region: WorldRegion;
}

/**
 *  Info of the countries which I've been travelled to.
 *
 *  TODO:  introducing more on how much percentage of country
 *         being explored, this could be calculated by "attractions
 *         I've gone to" divided by "all attractions I wanted to go"
 */
export const COUNTRY_INFO_MAP: Record<string, CountryInfo> = {
    us: {
        fullname: 'United States of America',
        name: 'United States',
        aliases: ['US', 'USA'],
        countryCode: 'us',
        region: 'North America',
    },
    de: {
        fullname: 'Bundesrepublik Deutschland',
        fullnameTranslation: 'Federal Republic of Germany',
        name: 'Germany',
        aliases: ['Deutschland'],
        countryCode: 'de',
        region: 'Europe',
    },
    fr: {
        fullname: 'République Française',
        fullnameTranslation: 'French Republic',
        name: 'France',
        countryCode: 'fr',
        region: 'Europe',
    },
    es: {
        fullname: 'Reino de España',
        fullnameTranslation: 'Kingdom of Spain',
        name: 'Spain',
        aliases: ['España'],
        countryCode: 'es',
        region: 'Europe',
    },
    it: {
        fullname: 'Repubblica Italiana',
        fullnameTranslation: 'Italian Republic',
        name: 'Italy',
        aliases: ['Italia'],
        countryCode: 'it',
        region: 'Europe',
    },
    va: {
        fullname: 'Stato della Città del Vaticano',
        fullnameTranslation: 'Vatican City State',
        name: 'Vatican City',
        aliases: ['Vatican', 'Holy See', 'Città del Vaticano'],
        countryCode: 'va',
        region: 'Europe',
    },
    gb: {
        fullname: 'United Kingdom of Great Britain and Northern Ireland',
        name: 'United Kingdom',
        aliases: ['UK', 'Great Britain', 'Britain'],
        countryCode: 'gb',
        region: 'Europe',
    },
    se: {
        fullname: 'Konungariket Sverige',
        fullnameTranslation: 'Kingdom of Sweden',
        name: 'Sweden',
        aliases: ['Sverige'],
        countryCode: 'se',
        region: 'Europe',
    },
    dk: {
        fullname: 'Kongeriget Danmark',
        fullnameTranslation: 'Kingdom of Denmark',
        name: 'Denmark',
        aliases: ['Danmark'],
        countryCode: 'dk',
        region: 'Europe',
    },
    fi: {
        fullname: 'Suomen Tasavalta',
        fullnameTranslation: 'Republic of Finland',
        name: 'Finland',
        aliases: ['Suomi'],
        countryCode: 'fi',
        region: 'Europe',
    },
    lv: {
        fullname: 'Latvijas Republika',
        fullnameTranslation: 'Republic of Latvia',
        name: 'Latvia',
        countryCode: 'lv',
        region: 'Europe',
    },
    lt: {
        fullname: 'Lietuvos Respublika',
        fullnameTranslation: 'Republic of Lithuania',
        name: 'Lithuania',
        aliases: ['Lietuva'],
        countryCode: 'lt',
        region: 'Europe',
    },
    at: {
        fullname: 'Republik Österreich',
        fullnameTranslation: 'Republic of Austria',
        name: 'Austria',
        aliases: ['Österreich'],
        countryCode: 'at',
        region: 'Europe',
    },
    sk: {
        fullname: 'Slovenská Republika',
        fullnameTranslation: 'Republic of Slovakia',
        name: 'Slovakia',
        aliases: ['Slovakia', 'Slovensko'],
        countryCode: 'sk',
        region: 'Europe',
    },
    hu: {
        fullname: 'Magyarország',
        fullnameTranslation: 'Hungarian Republic',
        name: 'Hungary',
        countryCode: 'hu',
        region: 'Europe',
    },
    gr: {
        fullname: 'Ελληνική Δημοκρατία',
        fullnameTranslation: 'Hellenic Republic',
        name: 'Greece',
        aliases: ['Ελλάδα', 'Ellinikí Dimokratía'],
        countryCode: 'gr',
        region: 'Europe',
    },
    tr: {
        fullname: 'Türkiye Cumhuriyeti',
        fullnameTranslation: 'Republic of Türkiye',
        name: 'Turkey',
        aliases: ['Türkiye'],
        countryCode: 'tr',
        region: 'Europe',
    },
    hr: {
        fullname: 'Republika Hrvatska',
        fullnameTranslation: 'Republic of Croatia',
        name: 'Croatia',
        aliases: ['Hrvatska'],
        countryCode: 'hr',
        region: 'Europe',
    },
    me: {
        fullname: 'Црна Гора (Crna Gora)',
        fullnameTranslation: 'Republic of Montenegro',
        name: 'Montenegro',
        countryCode: 'me',
        region: 'Europe',
    },
    al: {
        fullname: 'Republika e Shqipërisë',
        fullnameTranslation: 'Republic of Albania',
        name: 'Albania',
        aliases: ['Shqipëri', 'Shqipëria'],
        countryCode: 'al',
        region: 'Europe',
    },
    ba: {
        fullname: 'Босна и Херцеговина',
        name: 'Bosnia and Herzegovina',
        aliases: [
            'BiH',
            'Bosna i Hercegovina',
            'Bosnia & Herzegovina',
            'Bosnia-Herzegovina',
        ],
        countryCode: 'ba',
        region: 'Europe',
    },
    in: {
        fullname: 'भारत गणराज्य',
        fullnameTranslation: 'Republic of India',
        name: 'India',
        aliases: ['Bhārat', 'Bharat', 'Bhārat Gaṇarājya'],
        countryCode: 'in',
        region: 'Asia',
    },
    eg: {
        fullname: 'جمهورية مصر العربية',
        fullnameTranslation: 'Arab Republic of Egypt',
        name: 'Egypt',
        aliases: ['Misr', 'مصر'],
        countryCode: 'eg',
        region: 'Africa',
    },
};
