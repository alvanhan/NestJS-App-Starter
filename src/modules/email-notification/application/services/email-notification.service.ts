import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailNotification } from '../../domain/entities';
import { IEmailProvider, IEmailTemplateRenderer } from '../../domain/interfaces';
import { SendEmailNotificationDto, EmailVerificationNotificationDto } from '../dto';
import { generateUuid } from '../../../../utils/uuid.util';

/**
 * Email notification service.
 * Handles email notification operations at the application level.
 */
@Injectable()
export class EmailNotificationService {
    private readonly logger = new Logger(EmailNotificationService.name);

    constructor(
        @Inject('IEmailProvider') private readonly emailProvider: IEmailProvider,
        @Inject('IEmailTemplateRenderer') private readonly templateRenderer: IEmailTemplateRenderer,
        private readonly configService: ConfigService,
    ) {}

    /**
     * Sends an email notification.
     */
    async sendEmailNotification(dto: SendEmailNotificationDto): Promise<void> {
        try {
            const notification = new EmailNotification(
                generateUuid(),
                dto.to,
                dto.subject,
                dto.template,
                dto.templateData,
                dto.priority,
                dto.from,
                new Date(),
                dto.scheduledAt,
            );

            await this.emailProvider.sendEmail(notification);

            this.logger.log(`Email notification sent successfully to ${dto.to}`);
        } catch (error) {
            this.logger.error(`Failed to send email notification to ${dto.to}`, error.stack);
            throw error;
        }
    }

    /**
     * Sends email verification notification.
     */
    async sendEmailVerificationNotification(dto: EmailVerificationNotificationDto): Promise<void> {
        try {
            const verificationUrl = this.buildVerificationUrl(dto.verificationToken);
            
            const notification = EmailNotification.forEmailVerification(
                generateUuid(),
                dto.email,
                {
                    fullName: dto.fullName,
                    verificationToken: dto.verificationToken,
                    verificationUrl,
                },
            );

            await this.emailProvider.sendEmail(notification);

            this.logger.log(`Email verification notification sent successfully to ${dto.email}`);
        } catch (error) {
            this.logger.error(`Failed to send email verification notification to ${dto.email}`, error.stack);
            throw error;
        }
    }

    /**
     * Sends welcome email notification.
     */
    async sendWelcomeNotification(email: string, fullName: string): Promise<void> {
        try {
            const notification = EmailNotification.forWelcome(
                generateUuid(),
                email,
                { fullName },
            );

            await this.emailProvider.sendEmail(notification);

            this.logger.log(`Welcome email notification sent successfully to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send welcome email notification to ${email}`, error.stack);
            throw error;
        }
    }

    /**
     * Validates email configuration.
     */
    async validateConfiguration(): Promise<boolean> {
        try {
            return await this.emailProvider.validateConfiguration();
        } catch (error) {
            this.logger.error('Failed to validate email configuration', error.stack);
            return false;
        }
    }

    /**
     * Builds verification URL.
     */
    private buildVerificationUrl(token: string): string {
        const baseUrl = this.configService.get<string>('APP_BASE_URL', 'http://localhost:9000');
        return `${baseUrl}/auth/verify-email?token=${token}`;
    }
}
