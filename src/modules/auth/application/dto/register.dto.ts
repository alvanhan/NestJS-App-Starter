import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    full_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}
