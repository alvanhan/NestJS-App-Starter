import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { ConfigurationService } from 'src/config/configuration.service';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { AuthController } from './application/auth.controller';
import { LoginUseCase } from './usecase/login.usecase';
import { RegisterUseCase } from './usecase/register.usecase';
import { VerifyEmailUseCase } from './usecase/verify-email.usecase';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthService } from './application/auth.service';
import { RefreshTokenService } from './application/refresh-token.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([User, RefreshToken]),
        PassportModule,
        RabbitModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const config = new ConfigurationService(configService);
                const jwtConfig = config.jwt;
                return {
                    secret: jwtConfig.secret,
                    signOptions: { expiresIn: jwtConfig.expiration },
                };
            },
        }),
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        // Use cases
        LoginUseCase,
        RegisterUseCase,
        VerifyEmailUseCase,

        // Strategies
        JwtStrategy,

        // Services
        AuthService,
        RefreshTokenService,
    ],
    exports: []
})
export class AuthModule { }
