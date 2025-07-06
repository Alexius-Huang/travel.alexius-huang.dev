type Year = string;
type Month = string;
type Day = string;
export type DateFormat = `${Year}-${Month}-${Day}`;

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
});
