import { Injectable, Logger } from '@nestjs/common';
import { EmailNotificationService } from '../application/services';
import { EmailVerificationNotificationDto } from '../application/dto';
import { generateUuid } from '../../../utils/uuid.util';
import * as crypto from 'crypto';

/**
 * Use case for sending email verification notifications.
 * Handles the business logic for email verification process.
 */
@Injectable()
export class SendEmailVerificationUseCase {
    private readonly logger = new Logger(SendEmailVerificationUseCase.name);

    constructor(
        private readonly emailNotificationService: EmailNotificationService,
    ) {}

    /**
     * Executes the email verification notification use case.
     */
    async execute(email: string, fullName: string): Promise<string> {
        try {
            const verificationToken = this.generateVerificationToken();
            
            const dto: EmailVerificationNotificationDto = {
                email,
                fullName,
                verificationToken,
            };

            await this.emailNotificationService.sendEmailVerificationNotification(dto);

            this.logger.log(`Email verification notification sent to ${email}`);
            
            return verificationToken;
        } catch (error) {
            this.logger.error(`Failed to send email verification notification to ${email}`, error.stack);
            throw error;
        }
    }

    /**
     * Generates a secure verification token.
     */
    private generateVerificationToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }
}
