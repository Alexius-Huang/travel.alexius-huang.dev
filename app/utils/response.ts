type JSONResponseOptions = {
    status?: number;
    headers?: Record<string, string>;
}

export function json<T extends Record<string, unknown>>(
    body: T,
    options: JSONResponseOptions = {}
) {
    const { status = 200, headers = {} } = options;

    return new Response(JSON.stringify({ success: status === 200, ...body }), {
        status,
        headers: { 'Content-Type': 'application/json', ...headers },
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
    throw json({ error: 'Method Not Allowed' }, { status: 405 });
}
