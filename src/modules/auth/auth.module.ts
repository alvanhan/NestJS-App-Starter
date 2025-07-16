import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { AuthController } from './application/auth.controller';
import { LoginUseCase } from './usecase/login.usecase';
import { RegisterUseCase } from './usecase/register.usecase';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthService } from './application/auth.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
        secret: 'SECRET_JWT',
        signOptions: { expiresIn: '1d' },
    }),],
    controllers: [
        AuthController,
    ],
    providers: [
        // Use cases
        LoginUseCase,
        RegisterUseCase,

        // Strategies
        JwtStrategy,

        // Services
        AuthService,
    ],
    exports: []
})
export class AuthModule { }
