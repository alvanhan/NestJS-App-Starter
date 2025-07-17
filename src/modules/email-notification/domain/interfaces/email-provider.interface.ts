import { EmailNotification } from '../entities';

/**
 * Email provider interface.
 * Defines the contract for email sending implementations.
 */
export interface IEmailProvider {
    /**
     * Sends an email notification.
     */
    sendEmail(notification: EmailNotification): Promise<void>;

    /**
     * Validates email configuration.
     */
    validateConfiguration(): Promise<boolean>;
}
