import {
    Entity,
    Property,
    PrimaryKey,
    Unique,
    Enum,
    OneToMany,
    OptionalProps,
} from '@mikro-orm/core';
import { generateUuid } from '../utils';
import { UserProvider } from './user-provider.entity';
import { RefreshToken } from './refresh-token.entity';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPERADMIN = 'SUPERADMIN',
}

@Entity({ tableName: 'users' })
export class User {
    [OptionalProps]?: 'created_at' | 'updated_at';

    @PrimaryKey({ type: 'uuid' })
    id: string = generateUuid();

    @Property()
    full_name: string;

    @Property({ nullable: true })
    @Unique()
    email?: string;

    @Property({ nullable: true })
    @Unique()
    username?: string;

    @Property({ nullable: true })
    hashed_password?: string;

    @Property({ default: false })
    email_verified: boolean = false;

    @Property({ nullable: true })
    phone_number?: string;

    @Enum(() => UserRole)
    role: UserRole = UserRole.USER;

    @Property({ default: true })
    is_active: boolean = true;

    @Property({ nullable: true })
    last_login_at?: Date;

    @Property()
    created_at: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updated_at: Date = new Date();

    @Property({ nullable: true })
    deleted_at?: Date;

    @OneToMany(() => UserProvider, provider => provider.user)
    providers = new Array<UserProvider>();

    @OneToMany(() => RefreshToken, token => token.user)
    refreshTokens = new Array<RefreshToken>();
}
