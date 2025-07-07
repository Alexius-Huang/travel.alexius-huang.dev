interface ResponseError {
    status: number;
    data: {
        message: string;
    };
};

export function isResponseError(error: unknown): error is ResponseError {
    return typeof error === 'object' &&
        error !== null &&
        (error as Record<string, any>).data?._resErr;
};
