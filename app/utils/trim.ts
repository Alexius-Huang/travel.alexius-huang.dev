export function trim(strings: TemplateStringsArray, ...values: any[]): string {
    const fullString = strings.reduce((acc, str, i) => {
        return acc + str + (i < values.length ? values[i] : '');
    }, '');

    return fullString.trim().replace(/\s+/g, ' ');
}
