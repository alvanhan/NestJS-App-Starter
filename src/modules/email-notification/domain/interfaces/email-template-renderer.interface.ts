import { EmailTemplate } from '../enums';

/**
 * Email template renderer interface.
 * Defines the contract for email template rendering implementations.
 */
export interface IEmailTemplateRenderer {
    /**
     * Renders an email template with provided data.
     */
    render(template: EmailTemplate, data: Record<string, any>): Promise<string>;

    /**
     * Checks if a template exists.
     */
    templateExists(template: EmailTemplate): boolean;
}
