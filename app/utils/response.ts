export function json(body: Record<string, unknown>, status = 200) {
    return new Response(JSON.stringify({ success: status === 200, ...body }), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

export const HTTPMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
} as const;

export type HTTPMethods = keyof typeof HTTPMethod;

export function allowMethods(request: Request, methods: Array<HTTPMethods>) {
    if (methods.includes(request.method.toUpperCase() as HTTPMethods)) return;
    throw json({ error: 'Method Not Allowed' }, 405);
}
