import { Controller, Post, Body, UseGuards, Get, Request, Res, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterUseCase } from '../../auth/usecase/register.usecase';
import { LoginUseCase } from '../../auth/usecase/login.usecase';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { ControllerResponseUtil } from '../../../utils/controller-response.util';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
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
}
