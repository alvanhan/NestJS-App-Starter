export type ResponseStatus = 'success' | 'fail' | 'error';

export interface ApiResponse<T = any> {
    status: ResponseStatus;
    statusCode: number;
    message: string;
    data?: T;
    error?: any;
}

export interface PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface PaginatedResponse<T> extends ApiResponse {
    data: {
        items: T[];
        meta: PaginationMeta;
    };
}

export class ResponseFormatter {
    static success<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> {
        return {
            status: 'success',
            statusCode,
            message,
            data,
        };
    }

    static paginate<T>(
        items: T[],
        meta: PaginationMeta,
        message = 'Success',
        statusCode = 200,
    ): PaginatedResponse<T> {
        return {
            status: 'success',
            statusCode,
            message,
            data: {
                items,
                meta,
            },
        };
    }

    static fail(message = 'Fail', statusCode = 400, error?: any): ApiResponse {
        return {
            status: 'fail',
            statusCode,
            message,
            error,
        };
    }

    static error(message = 'Internal Server Error', statusCode = 500, error?: any): ApiResponse {
        return {
            status: 'error',
            statusCode,
            message,
            error,
        };
    }
}
