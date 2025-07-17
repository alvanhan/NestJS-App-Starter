import { IsString, IsEmail } from 'class-validator';

/**
 * DTO for email verification notifications.
 */
export class EmailVerificationNotificationDto {
    @IsEmail()
    email: string;

    @IsString()
    fullName: string;

    @IsString()
    verificationToken: string;
}
