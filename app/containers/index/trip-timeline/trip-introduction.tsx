import { useMemo, type FC } from 'react';
import { COUNTRY_INFO_MAP } from '~/data-access/country';
import { CountryFlagChip } from '~/ui/country-flag-chip';
import { TagList } from '~/components/tag-list';
import { trim } from '~/utils/trim';
import { CalendarDateRangeOutlineIcon } from '~/icons/outline/calendar-date-range';
import { daysBetween } from '~/utils/date';
import { dateFormatter } from '~/data-access/date';
import type { TripDetails } from '~/data-access/trips';
import { NavLink } from '~/components/nav-link';
import { useViewTransition } from '~/hooks/use-view-transition';

export interface TripIntroductionProps extends TripDetails {
    className?: string;
}

export const TripIntroduction: FC<TripIntroductionProps> = ({
    id: tripId,
    className,
    title,
    subtitle,
    description,
    tags,
    countryCodes,
    date: { from, to },
}) => {
    const daysPassed = useMemo(() => daysBetween(from, to), [from, to]);
    const formattedDate = useMemo(
        () => ({
            from: dateFormatter.format(new Date(from)),
            to: dateFormatter.format(new Date(to)),
        }),
        [from, to],
    );

    const tripDetailsLink = `trips/${tripId}`;
    const vt = useViewTransition(tripDetailsLink, [
        'trip-title',
        'trip-subtitle',
        'trip-date-range',
        'trip-country-list',
        'trip-description',
        'trip-tags',
    ]);

    return (
        <article className={`relative flex flex-col gap-y-1.5 ${className}`}>
            <h3
                className={`text-2xl font-bold uppercase text-blue-500 dark:text-blue-400 ${vt.tripTitle}`}
            >
                {title}
            </h3>
            <p
                className={trim`
                    text-base lg:text-lg font-medium tracking-wide line-clamp-2
                    text-gray-500 dark:text-gray-300
                    ${vt.tripSubtitle}
                `}
            >
                {subtitle}
            </p>

            <div
                className={trim`
                flex items-center gap-x-1.5 gap-y-1.5 mt-1 mb-2
                text-xs font-normal text-blue-500 dark:text-yellow-300
                flex-wrap
                ${vt.tripDateRange}
            `}
            >
                <div>
                    <CalendarDateRangeOutlineIcon className='inline-block' size="sm" />
                    <span className="font-semibold font-header mr-1.5 direction-ltr align-middle ml-1.5">
                        {daysPassed} DAY{daysPassed > 1 ? 'S' : ''}
                    </span>
                </div>

                <div>
                    <time dateTime={from}>{formattedDate.from}</time>
                    <span aria-hidden="true">{' '}~{' '}</span>
                    <time dateTime={to}>{formattedDate.to}</time>
                    <span className="sr-only">
                        from {formattedDate.from} to {formattedDate.to}
                    </span>
                </div>
            </div>

            <div
                className={`flex flex-row flex-wrap gap-x-2 gap-y-1.5 mb-1 ${vt.tripCountryList}`}
            >
                {countryCodes.map((cc) => (
                    <CountryFlagChip
                        key={cc}
                        size="sm"
                        countryCode={cc}
                        name={COUNTRY_INFO_MAP[cc].name}
                        variant="horizontal"
                        className="direction-ltr"
                    />
                ))}
            </div>

            <p className={`text-sm lg:text-base tracking-wide font-light mb-4 line-clamp-3 ${vt.tripDescription}`}>
                {description}
            </p>

            {tags && <TagList tags={tags} className={vt.tripTags} />}

            <div className="mt-4">
                <NavLink
                    size="sm"
                    aria-label={`Explore more about this trip: ${title}, ${subtitle}`}
                    to={tripDetailsLink}
                    viewTransition
                >
                    Explore More
                </NavLink>
            </div>

            <span aria-hidden="true" className="timeline-dot" />
        </article>
    );
};
