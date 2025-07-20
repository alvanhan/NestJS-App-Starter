import { User, UserRole } from '../../src/entities/user.entity';
import * as bcrypt from 'bcrypt';

export interface CreateUserData {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    emailVerified?: boolean;
    isActive?: boolean;
}

export class UserFactory {
    /**
     * Create a new user with hashed password
     */
    static async create(data: CreateUserData): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const user = new User();
        user.full_name = data.fullName;
        user.email = data.email;
        user.hashed_password = hashedPassword;
        user.role = data.role;
        user.email_verified = data.emailVerified ?? true;
        user.is_active = data.isActive ?? true;
        
        return user;
    }

    /**
     * Create multiple users at once
     */
    static async createMany(usersData: CreateUserData[]): Promise<User[]> {
        const users: User[] = [];
        
        for (const userData of usersData) {
            const user = await this.create(userData);
            users.push(user);
        }
        
        return users;
    }

    /**
     * Get default seed users configuration
     */
    static getDefaultSeedUsers(): CreateUserData[] {
        return [
            {
                fullName: 'Super Administrator',
                email: 'superadmin@nestapp.com',
                password: 'SuperAdmin123!',
                role: UserRole.SUPERADMIN,
                emailVerified: true,
                isActive: true,
            },
            {
                fullName: 'System Administrator',
                email: 'admin@nestapp.com',
                password: 'Admin123!',
                role: UserRole.ADMIN,
                emailVerified: true,
                isActive: true,
            },
            {
                fullName: 'Regular User',
                email: 'user@nestapp.com',
                password: 'User123!',
                role: UserRole.USER,
                emailVerified: true,
                isActive: true,
            },
            {
                fullName: 'Demo User',
                email: 'demo@nestapp.com',
                password: 'Demo123!',
                role: UserRole.USER,
                emailVerified: false,
                isActive: true,
            },
            {
                fullName: 'Test User Inactive',
                email: 'inactive@nestapp.com',
                password: 'Inactive123!',
                role: UserRole.USER,
                emailVerified: true,
                isActive: false,
            },
        ];
    }
}
