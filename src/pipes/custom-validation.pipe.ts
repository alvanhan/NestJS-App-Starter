import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
    private readonly logger = new Logger(CustomValidationPipe.name);

    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                const errors = this.formatErrors(validationErrors);
                
                this.logger.debug('Validation Errors:', JSON.stringify(errors, null, 2));
                
                return new BadRequestException({
                    message: 'Validation failed',
                    errors,
                });
            },
        });
    }

    private formatErrors(validationErrors: ValidationError[]): Record<string, string[]> {
        const formattedErrors: Record<string, string[]> = {};

        const extractErrors = (errors: ValidationError[], parentPath = '') => {
            errors.forEach(error => {
                const fieldPath = parentPath ? `${parentPath}.${error.property}` : error.property;
                
                if (error.constraints) {
                    formattedErrors[fieldPath] = Object.values(error.constraints);
                }

                if (error.children && error.children.length > 0) {
                    extractErrors(error.children, fieldPath);
                }
            });
        };

        extractErrors(validationErrors);
        return formattedErrors;
    }
}
