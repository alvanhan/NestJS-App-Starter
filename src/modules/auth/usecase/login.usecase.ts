import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../../../entities/user.entity';
import * as bcrypt from 'bcrypt';
/**
 * Use case for user login.
 * Validates user credentials and returns user data if successful.
 */
@Injectable()
export class LoginUseCase {
    constructor(private readonly em: EntityManager) { }

    async execute(email: string, password: string): Promise<User> {
        const user = await this.em.findOne(User, { email });
        if (!user || !user.hashed_password) throw new Error('Invalid credentials');

        const match = await bcrypt.compare(password, user.hashed_password);
        if (!match) throw new Error('Invalid credentials');

        return user;
    }
}
