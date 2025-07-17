import { IsString, IsEmail, IsOptional, IsEnum, IsObject } from 'class-validator';
import { EmailTemplate, EmailPriority } from '../../domain/enums';

/**
 * DTO for sending email notifications.
 */
export class SendEmailNotificationDto {
    @IsEmail()
    to: string;

    @IsString()
    subject: string;

    @IsEnum(EmailTemplate)
    template: EmailTemplate;

    @IsObject()
    templateData: Record<string, any>;

    @IsOptional()
    @IsEnum(EmailPriority)
    priority?: EmailPriority;

    @IsOptional()
    @IsEmail()
    from?: string;

    @IsOptional()
    scheduledAt?: Date;
}
