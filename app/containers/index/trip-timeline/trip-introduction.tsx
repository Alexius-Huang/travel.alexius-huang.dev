import { useMemo, type FC } from 'react';
import { Button } from '~/components/button';
import { COUNTRY_INFO_MAP } from '~/data-access/country';
import { CountryFlagChip } from '~/ui/country-flag-chip';
import { TagList } from './tag-list';
import { trim } from '~/utils/trim';
import { CalendarDateRangeOutlineIcon } from '~/icons/outline/calendar-date-range';
import { daysBetween } from '~/utils/date';
import { dateFormatter } from '~/data-access/date';
import type { TripDetails } from '~/data-access/trips';
import { NavLink } from '~/components/nav-link';

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

    return (
        <article className={`relative flex flex-col gap-y-1.5 ${className}`}>
            <h3 className="text-2xl font-bold uppercase text-blue-500 dark:text-blue-400">
                {title}
            </h3>
            <p
                className={trim`
                text-lg font-medium tracking-wide line-clamp-2
                text-gray-500 dark:text-gray-300
            `}
            >
                {subtitle}
            </p>

            <div
                className={trim`
                flex items-center gap-x-1.5 mt-1 mb-2
                text-xs font-normal text-blue-500/80 dark:text-yellow-300
            `}
            >
                <CalendarDateRangeOutlineIcon size="sm" />
                <span className="font-semibold font-header mr-1.5 direction-ltr">
                    {daysPassed} DAYS
                </span>
                <time dateTime={from}>{formattedDate.from}</time>
                <span aria-hidden="true">~</span>
                <time dateTime={to}>{formattedDate.to}</time>
                <span className="sr-only">
                    from {formattedDate.from} to {formattedDate.to}
                </span>
            </div>

            <div className="flex flex-row flex-wrap gap-x-2 gap-y-1.5 mb-1">
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

            <p className="text-md tracking-wide font-light mb-4 line-clamp-3">
                {description}
            </p>

            {tags && <TagList tags={tags} />}

            <div className="mt-4">
                <NavLink
                    size="sm"
                    aria-label={`Explore More about ${title}`}
                    to={`/trips/${tripId}`}
                >
                    Explore More
                </NavLink>
            </div>

            <span aria-hidden="true" className="timeline-dot" />
        </article>
    );
};
