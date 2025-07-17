import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailNotificationService } from './application/services';
import { SendEmailVerificationUseCase, SendWelcomeEmailUseCase } from './usecase';
import { GmailEmailProvider, HtmlTemplateRenderer } from './infrastructure/adapters';
import { IEmailProvider, IEmailTemplateRenderer } from './domain/interfaces';

/**
 * Email notification module.
 * Configures email notification services and providers.
 */
@Module({
    imports: [ConfigModule],
    providers: [
        // Application Services
        EmailNotificationService,
        
        // Use Cases
        SendEmailVerificationUseCase,
        SendWelcomeEmailUseCase,
        
        // Infrastructure Adapters
        {
            provide: 'IEmailProvider',
            useClass: GmailEmailProvider,
        },
        {
            provide: 'IEmailTemplateRenderer',
            useClass: HtmlTemplateRenderer,
        },
    ],
    exports: [
        EmailNotificationService,
        SendEmailVerificationUseCase,
        SendWelcomeEmailUseCase,
    ],
})
export class EmailNotificationModule {}
