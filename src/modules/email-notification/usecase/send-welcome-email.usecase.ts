import { Injectable, Logger } from '@nestjs/common';
import { EmailNotificationService } from '../application/services';

/**
 * Use case for sending welcome email notifications.
 * Handles the business logic for welcome email process.
 */
@Injectable()
export class SendWelcomeEmailUseCase {
    private readonly logger = new Logger(SendWelcomeEmailUseCase.name);

    constructor(
        private readonly emailNotificationService: EmailNotificationService,
    ) {}

    /**
     * Executes the welcome email notification use case.
     */
    async execute(email: string, fullName: string): Promise<void> {
        try {
            await this.emailNotificationService.sendWelcomeNotification(email, fullName);

            this.logger.log(`Welcome email notification sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send welcome email notification to ${email}`, error.stack);
            throw error;
        }
    }
}
