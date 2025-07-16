import { Controller, Post, Body, UseGuards, Get, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterUseCase } from '../../auth/usecase/register.usecase';
import { LoginUseCase } from '../../auth/usecase/login.usecase';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { ResponseFormatter } from '../../../utils/response';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Request() req) {
        try {
            const user = await this.registerUseCase.execute(dto.full_name, dto.email, dto.password);
            const tokens = await this.authService.generateTokens(
                user,
                req.headers['user-agent'],
                req.ip
            );
            return ResponseFormatter.success({
                ...tokens
            }, 'Registrasi successful');
        } catch (error) {
            return ResponseFormatter.fail('Registrasi failed', 400, error.message);
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Request() req) {
        try {
            const user = await this.loginUseCase.execute(dto.email, dto.password);
            const tokens = await this.authService.generateTokens(
                user,
                req.headers['user-agent'],
                req.ip
            );
            return ResponseFormatter.success({
                ...tokens
            }, 'Login successful');
        } catch (error) {
            return ResponseFormatter.fail('Login failed', 400, error.message);
        }
    }

    @Post('refresh')
    async refreshToken(@Body() dto: RefreshTokenDto) {
        try {
            const result = await this.authService.refreshTokens(dto.refreshToken);
            return ResponseFormatter.success({
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }, 'Token refreshed successfully');
        } catch (error) {
            return ResponseFormatter.fail('Token refresh failed', 401, error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Body() dto: RefreshTokenDto, @Request() req) {
        try {
            await this.authService.revokeRefreshToken(dto.refreshToken);
            return ResponseFormatter.success(null, 'Logout successful');
        } catch (error) {
            return ResponseFormatter.fail('Logout failed', 400, error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout-all')
    async logoutAll(@Request() req) {
        try {
            await this.authService.revokeAllUserTokens(req.user.id);
            return ResponseFormatter.success(null, 'Logged out from all devices');
        } catch (error) {
            return ResponseFormatter.fail('Logout all failed', 400, error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() req) {
        return ResponseFormatter.success(req.user, 'Data user');
    }
}
