import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { IEmailProvider, IEmailTemplateRenderer } from '../../domain/interfaces';
import { EmailNotification } from '../../domain/entities';

/**
 * SMTP email provider implementation.
 * Handles email sending using SMTP through nodemailer.
 */
@Injectable()
export class GmailEmailProvider implements IEmailProvider {
    private readonly logger = new Logger(GmailEmailProvider.name);
    private transporter: Transporter;

    constructor(
        private readonly configService: ConfigService,
        @Inject('IEmailTemplateRenderer') private readonly templateRenderer: IEmailTemplateRenderer,
    ) {
        this.initializeTransporter();
    }

    /**
     * Sends an email notification.
     */
    async sendEmail(notification: EmailNotification): Promise<void> {
        try {
            const htmlContent = await this.templateRenderer.render(
                notification.template,
                notification.templateData,
            );

            const mailOptions = {
                from: notification.from || this.configService.get<string>('SMTP_FROM'),
                to: notification.to,
                subject: notification.subject,
                html: htmlContent,
                priority: this.mapPriorityToNodemailer(notification.priority),
            };

            await this.transporter.sendMail(mailOptions);

            this.logger.log(`Email sent successfully to ${notification.to}`);
        } catch (error) {
            this.logger.error(
                `Failed to send email to ${notification.to}`,
                error.stack,
            );
            throw error;
        }
    }

    /**
     * Validates email configuration.
     */
    async validateConfiguration(): Promise<boolean> {
        try {
            await this.transporter.verify();
            this.logger.log('Email configuration is valid');
            return true;
        } catch (error) {
            this.logger.error('Email configuration is invalid', error.stack);
            return false;
        }
    }

    /**
     * Initializes the nodemailer transporter.
     */
    private initializeTransporter(): void {
        const smtpHost = this.configService.get<string>('SMTP_HOST');
        const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
        const smtpUser = this.configService.get<string>('SMTP_USER');
        const smtpPassword = this.configService.get<string>('SMTP_PASSWORD');
        const smtpSecure = this.configService.get<string>('SMTP_SECURE', 'false') === 'true';

        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPassword,
            },
            logger: this.configService.get<string>('NODE_ENV') === 'development',
            debug: this.configService.get<string>('NODE_ENV') === 'development',
        });
    }

    /**
     * Maps email priority to nodemailer priority.
     */
    private mapPriorityToNodemailer(priority: string): 'high' | 'normal' | 'low' {
        switch (priority) {
            case 'urgent':
            case 'high':
                return 'high';
            case 'low':
                return 'low';
            default:
                return 'normal';
        }
    }
}
