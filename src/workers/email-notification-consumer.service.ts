import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SendEmailVerificationUseCase, SendWelcomeEmailUseCase } from '../modules/email-notification/usecase';

/**
 * Email notification consumer.
 * Handles RabbitMQ messages for email notifications.
 */
@Controller()
export class EmailNotificationConsumer {
    private readonly logger = new Logger(EmailNotificationConsumer.name);

    constructor(
        private readonly sendEmailVerificationUseCase: SendEmailVerificationUseCase,
        private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase,
    ) {}

    /**
     * Handles user registration email verification.
     */
    @EventPattern('user.registered')
    async handleUserRegistered(@Payload() data: { email: string; fullName: string }): Promise<void> {
        try {
            this.logger.log(`Processing user registration notification for ${data.email}`);
            
            const verificationToken = await this.sendEmailVerificationUseCase.execute(
                data.email,
                data.fullName,
            );

            this.logger.log(`Email verification sent successfully to ${data.email}, token: ${verificationToken}`);
        } catch (error) {
            this.logger.error(`Failed to process user registration notification for ${data.email}`, error.stack);
            throw error;
        }
    }

    /**
     * Handles user email verification success.
     */
    @EventPattern('user.email.verified')
    async handleUserEmailVerified(@Payload() data: { email: string; fullName: string }): Promise<void> {
        try {
            this.logger.log(`Processing welcome email notification for ${data.email}`);
            
            await this.sendWelcomeEmailUseCase.execute(data.email, data.fullName);

            this.logger.log(`Welcome email sent successfully to ${data.email}`);
        } catch (error) {
            this.logger.error(`Failed to process welcome email notification for ${data.email}`, error.stack);
            throw error;
        }
    }
}
