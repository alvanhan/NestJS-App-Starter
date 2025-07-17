import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { UserRole } from "src/entities/user.entity";
import { RabbitService } from "src/rabbit/rabbit.service";
import * as bcrypt from "bcrypt";

/**
 * Use case for user registration.
 * Validates input and creates a new user if successful.
 */
@Injectable()
export class RegisterUseCase {
    constructor(
        private readonly em: EntityManager,
        private readonly rabbitService: RabbitService,
    ) { }
    
    async execute(full_name: string, email: string, password: string): Promise<User> {
        const existing = await this.em.findOne(User, { email });
        if (existing) throw new Error('Email already registered');
        
        const hashed = await bcrypt.hash(password, 10);
        const user = this.em.create(User, {
            full_name,
            email,
            hashed_password: hashed,
            email_verified: false,
            role: UserRole.USER,
            is_active: true,
            providers: [],
            refreshTokens: [],
        });
        
        await this.em.persistAndFlush(user);
        
        // Send email notification via RabbitMQ
        await this.rabbitService.sendMessage('user.registered', {
            email: user.email,
            fullName: user.full_name,
        });
        
        return user;
    }
}
