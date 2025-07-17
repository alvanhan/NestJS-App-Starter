import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { RabbitService } from 'src/rabbit/rabbit.service';

/**
 * Use case for email verification.
 * Handles the business logic for email verification process.
 */
@Injectable()
export class VerifyEmailUseCase {
    constructor(
        private readonly em: EntityManager,
        private readonly rabbitService: RabbitService,
    ) {}

    /**
     * Verifies user email with token.
     */
    async execute(token: string): Promise<User> {
        // In a real application, you would store the token in database
        // For now, we'll just find user by email (this is simplified)
        
        // TODO: Implement proper token verification
        // const verificationToken = await this.em.findOne(EmailVerificationToken, { token });
        // if (!verificationToken || verificationToken.isExpired()) {
        //     throw new Error('Invalid or expired verification token');
        // }
        
        // For demo purposes, we'll assume the token is valid
        // In real implementation, you should decode the token to get user info
        const user = await this.em.findOne(User, { email_verified: false });
        
        if (!user) {
            throw new Error('User not found or already verified');
        }
        
        user.email_verified = true;
        await this.em.persistAndFlush(user);
        
        // Send welcome email notification via RabbitMQ
        await this.rabbitService.sendMessage('user.email.verified', {
            email: user.email,
            fullName: user.full_name,
        });
        
        return user;
    }
}
