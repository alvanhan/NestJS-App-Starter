import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
    async register(@Body() dto: RegisterDto) {
        try {
            const user = await this.registerUseCase.execute(dto.full_name, dto.email, dto.password);
            const token = this.authService.generateToken(user);
            return ResponseFormatter.success({ token }, 'Registrasi successful');
        } catch (error) {
            return ResponseFormatter.fail('Registrasi failed', 400, error.message);
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        try {
            const user = await this.loginUseCase.execute(dto.email, dto.password);
            const token = this.authService.generateToken(user);
            return ResponseFormatter.success({ token }, 'Login successful');
        } catch (error) {
            return ResponseFormatter.fail('Login failed', 400, error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() req) {
        return ResponseFormatter.success(req.user, 'Data user');
    }
}
