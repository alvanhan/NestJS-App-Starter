import { FastifyReply } from 'fastify';

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
    private static createResponse<T>(
        status: ResponseStatus,
        statusCode: number,
        message: string,
        data?: T,
        error?: any
    ): ApiResponse<T> {
        return { status, statusCode, message, data, error };
    }

    private static sendResponse(reply: FastifyReply, response: ApiResponse): void {
        reply.status(response.statusCode).send(response);
    }

    // Success methods
    static success<T>(reply: FastifyReply, data: T, message = 'Success', statusCode = 200): void {
        const response = this.createResponse('success', statusCode, message, data);
        this.sendResponse(reply, response);
    }

    static successResponse<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> {
        return this.createResponse('success', statusCode, message, data);
    }

    // Pagination
    static paginate<T>(
        reply: FastifyReply,
        items: T[],
        meta: PaginationMeta,
        message = 'Success',
        statusCode = 200
    ): void {
        const response = this.createResponse('success', statusCode, message, { items, meta });
        this.sendResponse(reply, response);
    }

    // Fail methods
    static fail(reply: FastifyReply, message = 'Fail', statusCode = 400, error?: any): void {
        const response = this.createResponse('fail', statusCode, message, undefined, error);
        this.sendResponse(reply, response);
    }

    static failResponse(message = 'Fail', statusCode = 400, error?: any): ApiResponse {
        return this.createResponse('fail', statusCode, message, undefined, error);
    }

    // Error methods
    static error(reply: FastifyReply, message = 'Internal Server Error', statusCode = 500, error?: any): void {
        const response = this.createResponse('error', statusCode, message, undefined, error);
        this.sendResponse(reply, response);
    }

    static errorResponse(message = 'Internal Server Error', statusCode = 500, error?: any): ApiResponse {
        return this.createResponse('error', statusCode, message, undefined, error);
    }
}
