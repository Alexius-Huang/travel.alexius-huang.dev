export function json(body: Record<string, unknown>) {
    return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    };
}
