import { useLoaderData } from 'react-router';
import { trim } from '~/utils/trim';
import type { LoaderData } from './types';
import { useMemo, type FC } from 'react';
import { NavLink } from '~/components/nav-link';
import { CalendarDateRangeOutlineIcon } from '~/icons/outline/calendar-date-range';
import { daysBetween } from '~/utils/date';
import { dateFormatter } from '~/data-access/date';
import { CountryFlagChip } from '~/ui/country-flag-chip';
import { COUNTRY_INFO_MAP } from '~/data-access/country';
import { TagList } from '~/components/tag-list';
import './trip-introduction.css';
import { Breakpoint, useBreakpoint } from '~/hooks/use-breakpoint';

export interface TripIntroductionProps {
    className?: string;
}

export const TripIntroduction: FC<TripIntroductionProps> = ({ className }) => {
    const { tripDetails } = useLoaderData<LoaderData>();
    const {
        title,
        subtitle,
        description,
        tags,
        countryCodes,
        date: { from, to },
    } = tripDetails;

    const daysPassed = useMemo(() => daysBetween(from, to), [from, to]);
    const formattedDate = useMemo(
        () => ({
            from: dateFormatter.format(new Date(from)),
            to: dateFormatter.format(new Date(to)),
        }),
        [from, to],
    );
    const breakpoint = useBreakpoint();

    return (
        <article className={className}>
            <div className="flex justify-between items-center mt-8 mb-4">
                <h1
                    className={trim`
                    v-trans-trip-title
                    font-bold uppercase text-blue-500
                    text-2xl
                    xs:text-3xl sm:text-4xl md:text-5xl
                `}
                >
                    {title}
                </h1>

                <div>
                    {/**
                     *  TODO: design back button, checkout following ticket:
                     *        https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/40
                     */}

                    <NavLink
                        to="/"
                        aria-label="Back to Home Page"
                        viewTransition
                        size={breakpoint >= Breakpoint.MD ? 'md' : 'sm'}
                    >
                        Back
                    </NavLink>
                    {/**
                     *  TODO: creates next / previous trip button, checkout following ticket:
                     *        https://github.com/Alexius-Huang/travel.alexius-huang.dev/issues/41
                     */}
                    {/* <NavLink to={`/trips/${tripDetails.id + 1}`} aria-label='Next Trip'>Next Trip</NavLink> */}
                </div>
            </div>

            <p
                className={trim`
                v-trans-trip-subtitle my-3
                font-normal tracking-wide text-gray-500 dark:text-gray-300
                text-base sm:text-lg md:text-xl
            `}
            >
                {subtitle}
            </p>

            <div
                className={trim`
                flex flex-col sm:flex-row
                gap-[1rem]
                sm:items-center my-2
            `}
            >
                <div
                    className={trim`
                    flex items-center gap-x-1.5
                    text-blue-500 dark:text-yellow-300
                    v-trans-trip-date-range
                    font-normal
                    text-xs sm:text-base 
                `}
                >
                    <CalendarDateRangeOutlineIcon size="sm" />
                    <span className="font-semibold font-header mr-1.5">
                        {daysPassed} DAYS
                    </span>
                    <time dateTime={from}>{formattedDate.from}</time>
                    <span aria-hidden="true">~</span>
                    <time dateTime={to}>{formattedDate.to}</time>
                    <span className="sr-only">
                        from {formattedDate.from} to {formattedDate.to}
                    </span>
                </div>

                <span
                    aria-hidden="true"
                    className="hidden sm:inline text-xs font-extrabold mb-1 dark:text-gray-500 text-gray-400"
                >
                    @
                </span>

                <div className="flex flex-row flex-wrap gap-x-2 gap-y-1.5 mb-1 v-trans-trip-country-list">
                    {countryCodes.map((cc) => (
                        <CountryFlagChip
                            key={cc}
                            size="lg"
                            countryCode={cc}
                            name={COUNTRY_INFO_MAP[cc].name}
                            variant="horizontal"
                            className="direction-ltr"
                        />
                    ))}
                </div>
            </div>

            <p
                className={trim`
                text-normal sm:text-lg
                tracking-wide font-light my-6 v-trans-trip-description
            `}
            >
                {description}
            </p>

            {tags && (
                <TagList
                    tags={tags}
                    className="v-trans-trip-tags"
                    tagClassName="text-sm sm:!text-lg"
                />
            )}
        </article>
    );
};
