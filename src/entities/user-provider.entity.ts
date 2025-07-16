import {
    Entity,
    Property,
    PrimaryKey,
    ManyToOne,
    Enum,
} from '@mikro-orm/core';
import { generateUuid } from '../utils';
import { User } from './user.entity';

export enum AuthProvider {
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK',
    LOCAL = 'LOCAL'
}

@Entity({ tableName: 'user_providers' })
export class UserProvider {
    @PrimaryKey({ type: 'uuid' })
    id: string = generateUuid();

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
