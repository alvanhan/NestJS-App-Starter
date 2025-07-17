import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { IEmailTemplateRenderer } from '../../domain/interfaces';
import { EmailTemplate } from '../../domain/enums';

/**
 * HTML email template renderer implementation.
 * Handles email template rendering using HTML templates.
 */
@Injectable()
export class HtmlTemplateRenderer implements IEmailTemplateRenderer {
    private readonly logger = new Logger(HtmlTemplateRenderer.name);
    private readonly templatesPath: string;

    constructor(private readonly configService: ConfigService) {
        // Use path relative to project root
        this.templatesPath = path.join(process.cwd(), 'src/modules/email-notification/infrastructure/templates');
    }

    /**
     * Renders an email template with provided data.
     */
    async render(template: EmailTemplate, data: Record<string, any>): Promise<string> {
        try {
            const templatePath = this.getTemplatePath(template);
            let templateContent = await this.readTemplateFile(templatePath);

            // Simple template variable replacement
            templateContent = this.replaceTemplateVariables(templateContent, data);

            this.logger.log(`Template ${template} rendered successfully`);
            return templateContent;
        } catch (error) {
            this.logger.error(`Failed to render template ${template}`, error.stack);
            throw error;
        }
    }

    /**
     * Checks if a template exists.
     */
    templateExists(template: EmailTemplate): boolean {
        const templatePath = this.getTemplatePath(template);
        return fs.existsSync(templatePath);
    }

    /**
     * Gets the template file path.
     */
    private getTemplatePath(template: EmailTemplate): string {
        return path.join(this.templatesPath, `${template}.html`);
    }

    /**
     * Reads template file content.
     */
    private async readTemplateFile(templatePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(templatePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Replaces template variables with actual data.
     */
    private replaceTemplateVariables(template: string, data: Record<string, any>): string {
        let result = template;
        
        // Replace {{variable}} with actual values
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            result = result.replace(regex, data[key] || '');
        });

        // Add app configuration
        const appName = this.configService.get<string>('APP_NAME', 'Our Platform');
        const appUrl = this.configService.get<string>('APP_BASE_URL', 'http://localhost:3000');
        const supportEmail = this.configService.get<string>('SUPPORT_EMAIL', 'support@example.com');

        result = result.replace(/{{APP_NAME}}/g, appName);
        result = result.replace(/{{APP_URL}}/g, appUrl);
        result = result.replace(/{{SUPPORT_EMAIL}}/g, supportEmail);

        return result;
    }
}
