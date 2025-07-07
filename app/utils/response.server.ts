type JSONResponseOptions = {
    status?: number;
    headers?: Record<string, string>;
};

export function json<T extends Record<string, any>>(
    body: T,
    options: JSONResponseOptions = {},
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
    throw Errors.MethodNotAllowed();
}

export const Errors = {
    BadRequest: () => json({ _resErr: true, message: 'Bad Request' }, { status: 400 }),
    Unauthorized: () => json({ _resErr: true, message: 'Unauthorized' }, { status: 401 }),
    Forbidden: () => json({ _resErr: true, message: 'Forbidden' }, { status: 403 }),
    NotFound: () => json({ _resErr: true, message: 'Not Found' }, { status: 404 }),
    MethodNotAllowed: () => json({ _resErr: true, message: 'Method Not Allowed' }, { status: 405 }),

    InternalServerError: () => json({ _resErr: true, message: 'Internal Server Error' }, { status: 500 }),
};
