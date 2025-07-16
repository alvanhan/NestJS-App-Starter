import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../entities/user.entity';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService,
    ) { }

    generateToken(user: User): string {
        return this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });
    }

    async generateTokens(user: User, userAgent?: string, ipAddress?: string): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = this.generateToken(user);
        const refreshToken = await this.refreshTokenService.generateRefreshToken(user, userAgent, ipAddress);
        
        return {
            accessToken,
            refreshToken: refreshToken.token
        };
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
        return await this.refreshTokenService.refreshAccessToken(refreshToken);
    }

    async revokeRefreshToken(refreshToken: string): Promise<void> {
        await this.refreshTokenService.revokeRefreshToken(refreshToken);
    }

    async revokeAllUserTokens(userId: string): Promise<void> {
        await this.refreshTokenService.revokeAllUserRefreshTokens(userId);
    }
}
