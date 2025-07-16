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
            // Handle custom validation response from our CustomValidationPipe
            if (exceptionResponse.errors) {
                message = exceptionResponse.message || 'Validation failed';
                errors = exceptionResponse.errors;
            }
            // Handle default class-validator errors
            else if (Array.isArray(exceptionResponse.message)) {
                message = 'Validation failed';
                errors = this.formatValidationErrors(exceptionResponse.message);
            }
            // Handle single error message
            else if (typeof exceptionResponse.message === 'string') {
                message = exceptionResponse.message;
                errors = {};
            }
        }

        const errorResponse = ResponseFormatter.fail(
            message,
            status,
            errors
        );

        response.status(status).send(errorResponse);
    }

    private formatValidationErrors(errors: string[]): Record<string, string[]> {
        const formattedErrors: Record<string, string[]> = {};

        errors.forEach(error => {
            // Extract field name from error message
            const fieldMatch = error.match(/^(\w+)\s+/);
            if (fieldMatch) {
                const field = fieldMatch[1];
                if (!formattedErrors[field]) {
                    formattedErrors[field] = [];
                }
                formattedErrors[field].push(error);
            } else {
                // If field name can't be extracted, add to general errors
                if (!formattedErrors.general) {
                    formattedErrors.general = [];
                }
                formattedErrors.general.push(error);
            }
        });

        return formattedErrors;
    }
}
