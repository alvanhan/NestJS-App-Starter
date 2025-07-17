import { EmailTemplate, EmailPriority } from '../enums';

/**
 * Email notification domain entity.
 * Represents an email notification with all its properties.
 */
export class EmailNotification {
    constructor(
        public readonly id: string,
        public readonly to: string,
        public readonly subject: string,
        public readonly template: EmailTemplate,
        public readonly templateData: Record<string, any>,
        public readonly priority: EmailPriority = EmailPriority.NORMAL,
        public readonly from?: string,
        public readonly createdAt: Date = new Date(),
        public readonly scheduledAt?: Date,
        public readonly retryCount: number = 0,
        public readonly maxRetries: number = 3,
    ) {}

    /**
     * Creates a new email notification for email verification.
     */
    static forEmailVerification(
        id: string,
        to: string,
        templateData: { fullName: string; verificationToken: string; verificationUrl: string },
    ): EmailNotification {
        return new EmailNotification(
            id,
            to,
            'Verify Your Email Address',
            EmailTemplate.VERIFY_EMAIL,
            templateData,
            EmailPriority.HIGH,
        );
    }

    /**
     * Creates a new welcome email notification.
     */
    static forWelcome(
        id: string,
        to: string,
        templateData: { fullName: string },
    ): EmailNotification {
        return new EmailNotification(
            id,
            to,
            'Welcome to Our Platform',
            EmailTemplate.WELCOME,
            templateData,
            EmailPriority.NORMAL,
        );
    }

    /**
     * Checks if the email can be retried.
     */
    canRetry(): boolean {
        return this.retryCount < this.maxRetries;
    }

    /**
     * Increments the retry count.
     */
    incrementRetryCount(): EmailNotification {
        return new EmailNotification(
            this.id,
            this.to,
            this.subject,
            this.template,
            this.templateData,
            this.priority,
            this.from,
            this.createdAt,
            this.scheduledAt,
            this.retryCount + 1,
            this.maxRetries,
        );
    }
}
