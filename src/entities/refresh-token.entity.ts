import {
    Entity,
    Property,
    PrimaryKey,
    ManyToOne,
    Index,
    OptionalProps,
} from '@mikro-orm/core';
import { generateUuid } from '../utils';
import { User } from './user.entity';

@Entity({ tableName: 'refresh_tokens' })
@Index({ properties: ['token'] })
@Index({ properties: ['user', 'expires_at'] })
export class RefreshToken {
    [OptionalProps]?: 'created_at' | 'updated_at';

    @PrimaryKey({ type: 'uuid' })
    id: string = generateUuid();

    @Property({ type: 'text' })
    token: string;

    @ManyToOne(() => User)
    user: User;

    @Property()
    expires_at: Date;

    @Property({ default: false })
    is_revoked: boolean = false;

    @Property({ nullable: true })
    revoked_at?: Date;

    @Property({ nullable: true })
    user_agent?: string;

    @Property({ nullable: true })
    ip_address?: string;

    @Property()
    created_at: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updated_at: Date = new Date();

    // Helper method to check if token is expired
    isExpired(): boolean {
        return new Date() > this.expires_at;
    }

    // Helper method to check if token is valid
    isValid(): boolean {
        return !this.is_revoked && !this.isExpired();
    }

    // Helper method to revoke token
    revoke(): void {
        this.is_revoked = true;
        this.revoked_at = new Date();
    }
}
