import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseFormatter } from '../utils/response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors: any = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || message;
                errors = responseObj.errors || responseObj.error || null;
            } else {
                message = exceptionResponse as string;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            this.logger.error(`Unexpected error: ${exception.message}`, exception.stack);
        } else {
            this.logger.error('Unknown error occurred', exception);
        }

        this.logger.error(`HTTP ${status} Error: ${message}`, {
            url: request.url,
            method: request.method,
            errors,
        });

        ResponseFormatter.error(response, message, status, errors);
    }
}
