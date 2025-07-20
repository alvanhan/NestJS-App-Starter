import { Controller, Post, Body, UseGuards, Get, Request, Res, HttpStatus, Query } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { RegisterUseCase } from '../../auth/usecase/register.usecase';
import { LoginUseCase } from '../../auth/usecase/login.usecase';
import { VerifyEmailUseCase } from '../../auth/usecase/verify-email.usecase';
import { ListUsersUseCase } from '../../auth/usecase/list-users.usecase';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/guards/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';
import { UserRole } from '../../../entities/user.entity';
import { ControllerResponseUtil } from '../../../utils/controller-response.util';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly verifyEmailUseCase: VerifyEmailUseCase,
        private readonly listUsersUseCase: ListUsersUseCase,
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res() reply: FastifyReply) {
        await ControllerResponseUtil.handleAsync(
            reply,
            async () => {
                await this.registerUseCase.execute(dto.full_name, dto.email, dto.password);
                return null;
            },
            'Registration successful',
            HttpStatus.CREATED,
            'Registration failed'
        );
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Request() req, @Res() reply: FastifyReply) {
        await ControllerResponseUtil.handleAsync(
            reply,
            async () => {
                const user = await this.loginUseCase.execute(dto.email, dto.password);
                return await this.authService.generateTokens(
                    user,
                    req.headers['user-agent'],
                    req.ip
                );
            },
            'Login successful',
            HttpStatus.OK,
            'Login failed'
        );
    }

    @Post('refresh')
    async refreshToken(@Body() dto: RefreshTokenDto, @Res() reply: FastifyReply) {
        await ControllerResponseUtil.handleAsync(
            reply,
            async () => {
                const result = await this.authService.refreshTokens(dto.refreshToken);
                return {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                };
            },
            'Token refreshed successfully',
            HttpStatus.OK,
            'Token refresh failed',
            HttpStatus.UNAUTHORIZED
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Body() dto: RefreshTokenDto, @Res() reply: FastifyReply) {
        await ControllerResponseUtil.handleAsync(
            reply,
            async () => {
                await this.authService.revokeRefreshToken(dto.refreshToken);
                return null;
            },
            'Logout successful',
            HttpStatus.OK,
            'Logout failed'
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout-all')
    async logoutAll(@Request() req, @Res() reply: FastifyReply) {
        await ControllerResponseUtil.handleAsync(
            reply,
            async () => {
                await this.authService.revokeAllUserTokens(req.user.id);
                return null;
            },
            'Logged out from all devices',
            HttpStatus.OK,
            'Logout all failed'
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() req, @Res() reply: FastifyReply) {
        ControllerResponseUtil.handle(
            reply,
            () => req.user,
            'User data retrieved successfully'
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
    @Get('users')
    async listUsers(@Query() queryDto: ListUsersQueryDto, @Res() reply: FastifyReply) {
        await ControllerResponseUtil.handleAsync(
            reply,
            async () => {
                return await this.listUsersUseCase.execute(queryDto);
            },
            'Users retrieved successfully',
            HttpStatus.OK,
            'Failed to retrieve users'
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
    @Get('users/stats')
    async getUserStats(@Res() reply: FastifyReply) {
        await ControllerResponseUtil.handleAsync(
            reply,
            async () => {
                return await this.listUsersUseCase.getUserStats();
            },
            'User statistics retrieved successfully',
            HttpStatus.OK,
            'Failed to retrieve user statistics'
        );
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Res() reply: FastifyReply) {
        await ControllerResponseUtil.handleAsync(
            reply,
            async () => {
                if (!token) {
                    throw new Error('Verification token is required');
                }
                
                const user = await this.verifyEmailUseCase.execute(token);
                return {
                    message: 'Email verified successfully',
                    user: {
                        id: user.id,
                        email: user.email,
                        fullName: user.full_name,
                        emailVerified: user.email_verified
                    }
                };
            },
            'Email verification successful',
            HttpStatus.OK,
            'Email verification failed',
            HttpStatus.BAD_REQUEST
        );
    }
}
