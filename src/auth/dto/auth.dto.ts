import { IsEmail, IsNotEmpty, IsOptional, IsString, Max, MaxLength, MinLength } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(30)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;
}
