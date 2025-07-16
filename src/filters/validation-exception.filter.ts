import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ResponseFormatter } from '../utils/response';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ValidationExceptionFilter.name);

    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as any;
        let message = 'Validation failed';
        let errors = {};

        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            if (exceptionResponse.errors) {
                message = exceptionResponse.message || 'Validation failed';
                errors = exceptionResponse.errors;
            }
            else if (Array.isArray(exceptionResponse.message)) {
                message = 'Validation failed';
                errors = this.formatValidationErrors(exceptionResponse.message);
            }else if (typeof exceptionResponse.message === 'string') {
                message = exceptionResponse.message;
                errors = {};
            }
        }

        this.logger.error(`Validation error: ${message}`, { errors, status });

        ResponseFormatter.fail(response, message, status, errors);
    }

    private formatValidationErrors(errors: string[]): Record<string, string[]> {
        const formattedErrors: Record<string, string[]> = {};

        errors.forEach(error => {
            const fieldMatch = error.match(/^(\w+)\s+/);
            if (fieldMatch) {
                const field = fieldMatch[1];
                if (!formattedErrors[field]) {
                    formattedErrors[field] = [];
                }
                formattedErrors[field].push(error);
            } else {
                if (!formattedErrors.general) {
                    formattedErrors.general = [];
                }
                formattedErrors.general.push(error);
            }
        });

        return formattedErrors;
    }
}
