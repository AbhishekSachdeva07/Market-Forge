import {
    IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class UserOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    type!: 'login' | 'signup';

    @IsString()
    @IsOptional()
    otp?: string;
}