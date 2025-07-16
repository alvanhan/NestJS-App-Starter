import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

export class RefreshTokenResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email?: string;
        username?: string;
        full_name: string;
        role: string;
    };
}
