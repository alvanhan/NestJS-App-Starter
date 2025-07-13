// src/entities/user-provider.entity.ts
import {
    Entity,
    Property,
    PrimaryKey,
    ManyToOne,
    Enum,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

export enum AuthProvider {
    GOOGLE = 'GOOGLE',
    GITHUB = 'GITHUB',
    FACEBOOK = 'FACEBOOK',
    APPLE = 'APPLE',
    LOCAL = 'LOCAL',
}

@Entity({ tableName: 'user_providers' })
export class UserProvider {
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @ManyToOne(() => User)
    user: User;

    @Enum(() => AuthProvider)
    provider: AuthProvider;

    @Property()
    provider_user_id: string;

    @Property({ nullable: true })
    access_token?: string;

    @Property({ nullable: true })
    refresh_token?: string;

    @Property()
    linked_at: Date = new Date();
}
