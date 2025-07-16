import { FastifyReply } from 'fastify';
import { HttpStatus } from '@nestjs/common';
import { ResponseFormatter } from './response';

export class ControllerResponseUtil {
    /**
     * Handle async controller action with automatic error handling
     */
    static async handleAsync<T>(
        reply: FastifyReply,
        action: () => Promise<T>,
        successMessage: string = 'Success',
        successStatus: number = HttpStatus.OK,
        errorMessage: string = 'Operation failed',
        errorStatus: number = HttpStatus.BAD_REQUEST
    ): Promise<void> {
        try {
            const result = await action();
            ResponseFormatter.success(reply, result, successMessage, successStatus);
        } catch (error) {
            ResponseFormatter.fail(reply, errorMessage, errorStatus, error?.message || error);
        }
    }

    /**
     * Handle sync controller action with automatic error handling
     */
    static handle<T>(
        reply: FastifyReply,
        action: () => T,
        successMessage: string = 'Success',
        successStatus: number = HttpStatus.OK,
        errorMessage: string = 'Operation failed',
        errorStatus: number = HttpStatus.BAD_REQUEST
    ): void {
        try {
            const result = action();
            ResponseFormatter.success(reply, result, successMessage, successStatus);
        } catch (error) {
            ResponseFormatter.fail(reply, errorMessage, errorStatus, error?.message || error);
        }
    }
}
