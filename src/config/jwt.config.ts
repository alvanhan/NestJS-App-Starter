import { ConfigService } from '@nestjs/config';

export class JwtConfig {
    constructor(private configService: ConfigService) {}

    get secret(): string {
        return this.configService.get<string>('JWT_SECRET', 'your_jwt_secret');
    }

    get expiration(): string {
        const expirationSeconds = this.configService.get<string>('JWT_EXPIRATION', '3600');
        return expirationSeconds + 's';
    }

    get expirationNumber(): number {
        return parseInt(this.configService.get<string>('JWT_EXPIRATION', '3600'));
    }

    get refreshTokenSecret(): string {
        return this.configService.get<string>('JWT_REFRESH_SECRET', 'your_refresh_jwt_secret');
    }

    get refreshTokenExpiration(): string {
        const expirationSeconds = this.configService.get<string>('JWT_REFRESH_EXPIRATION', '604800'); // 7 days
        return expirationSeconds + 's';
    }

    get refreshTokenExpirationNumber(): number {
        return parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION', '604800'));
    }

    validateConfig(): void {
        if (!this.configService.get<string>('JWT_SECRET')) {
            throw new Error('JWT_SECRET is required');
        }
        
        const expiration = this.configService.get<string>('JWT_EXPIRATION');
        if (expiration && isNaN(parseInt(expiration))) {
            throw new Error('JWT_EXPIRATION must be a valid number');
        }

        const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION');
        if (refreshExpiration && isNaN(parseInt(refreshExpiration))) {
            throw new Error('JWT_REFRESH_EXPIRATION must be a valid number');
        }
    }
}

export const createJwtConfig = (configService: ConfigService) => {
    const jwtConfig = new JwtConfig(configService);
    jwtConfig.validateConfig();
    return {
        secret: jwtConfig.secret,
        signOptions: { expiresIn: jwtConfig.expiration },
    };
};
