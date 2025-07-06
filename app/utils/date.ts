import type { DateFormat } from '~/data-access/date';

export function daysBetween(startDate: DateFormat, endDate: DateFormat) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
}
