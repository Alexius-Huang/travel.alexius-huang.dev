import { forwardRef, type HTMLProps } from 'react';
import { NavLink } from '~/components/nav-link';
import { dateFormatter } from '~/data-access/date';
import type { TripLocation } from '~/data-access/trips';
import { trim } from '~/utils/trim';

export interface TripRouteLocationDetailProps
    extends HTMLProps<HTMLDivElement> {
    location: TripLocation;
}

export const TripRouteLocationDetail = forwardRef<
    HTMLDivElement,
    TripRouteLocationDetailProps
>(({ location, ...props }, ref) => {
    const { name, description, date } = location;

    const formattedDate = {
        from: dateFormatter.format(new Date(date.from)),
        to: date.to ? dateFormatter.format(new Date(date.to)) : undefined,
    };

    return (
        <div {...props} ref={ref}>
            <div className="w-full h-[30vh] pointer-events-none" />
            <div
                className={trim`
                    flex flex-col gap-y-[1rem] mb-[-30vh]
                    px-[1.5rem] py-[2rem] w-full
                    shadow-lg shadow-gray-100 dark:shadow-gray-900
                    backdrop-blur-xs bg-white/50 dark:bg-gray-900/50
                `}
            >
                <h3 className="text-4xl uppercase font-bold">{name}</h3>

                <div className="text-sm">
                    <time dateTime={formattedDate.from}>
                        {formattedDate.from}
                    </time>
                    <span aria-hidden="true"> ~ </span>
                    <time dateTime={formattedDate.to}>{formattedDate.to}</time>
                    <span className="sr-only">
                        from {formattedDate.from}
                        {formattedDate.to ? `to ${formattedDate.to}` : ''}
                    </span>
                </div>

                <p className="text-base font-light">{description}</p>

                <span className="self-end">
                    <NavLink
                        variant="secondary"
                        size="xs"
                        to={`/location/${location.nameId}`}
                        aria-label={`View more details of ${location.name}`}
                    >
                        View Details
                    </NavLink>
                </span>
            </div>
        </div>
    );
});
