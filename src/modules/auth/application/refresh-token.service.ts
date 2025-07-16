import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { RefreshToken } from '../../../entities/refresh-token.entity';
import { User } from '../../../entities/user.entity';
import { JwtConfig } from '../../../config/jwt.config';

@Injectable()
export class RefreshTokenService {
    private jwtConfig: JwtConfig;

    constructor(
        private readonly em: EntityManager,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.jwtConfig = new JwtConfig(configService);
    }

    async generateRefreshToken(user: User, userAgent?: string, ipAddress?: string): Promise<RefreshToken> {
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + this.jwtConfig.refreshTokenExpirationNumber);

        const refreshToken = new RefreshToken();
        refreshToken.token = token;
        refreshToken.user = user;
        refreshToken.expires_at = expiresAt;
        refreshToken.user_agent = userAgent;
        refreshToken.ip_address = ipAddress;

        await this.em.persistAndFlush(refreshToken);
        return refreshToken;
    }

    async findRefreshToken(token: string): Promise<RefreshToken | null> {
        return await this.em.findOne(RefreshToken, { token }, { populate: ['user'] });
    }

    async validateRefreshToken(token: string): Promise<RefreshToken> {
        const refreshToken = await this.findRefreshToken(token);
        
        if (!refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (!refreshToken.isValid()) {
            throw new UnauthorizedException('Refresh token is expired or revoked');
        }

        return refreshToken;
    }

    async revokeRefreshToken(token: string): Promise<void> {
        const refreshToken = await this.findRefreshToken(token);
        if (refreshToken) {
            refreshToken.revoke();
            await this.em.persistAndFlush(refreshToken);
        }
    }

    async revokeAllUserRefreshTokens(userId: string): Promise<void> {
        const refreshTokens = await this.em.find(RefreshToken, { 
            user: userId, 
            is_revoked: false 
        });

        for (const token of refreshTokens) {
            token.revoke();
        }

        await this.em.persistAndFlush(refreshTokens);
    }

    async cleanupExpiredTokens(): Promise<void> {
        const expiredTokens = await this.em.find(RefreshToken, {
            expires_at: { $lt: new Date() },
            is_revoked: false
        });

        for (const token of expiredTokens) {
            token.revoke();
        }

        await this.em.persistAndFlush(expiredTokens);
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
        const validRefreshToken = await this.validateRefreshToken(refreshToken);
        const user = validRefreshToken.user;

        // Generate new access token
        const accessToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        // Generate new refresh token and revoke old one
        await this.revokeRefreshToken(refreshToken);
        const newRefreshToken = await this.generateRefreshToken(user);

        return {
            accessToken,
            refreshToken: newRefreshToken.token,
            user
        };
    }
}
