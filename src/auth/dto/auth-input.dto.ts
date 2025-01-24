import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class AuthInputDTO {
  @ApiProperty({
    description: 'email of the user',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @MinLength(10)
  @MaxLength(30)
  readonly email: string;

  @ApiProperty({
    description: 'password given by user',
    type: String,
    required: true,
  })
  @MinLength(5)
  @MaxLength(30)
  readonly password: string;

  @ApiPropertyOptional({
    description: 'First name of the user',
    type: String,
  })
  @IsOptional()
  readonly firstName: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    type: String,
  })
  @IsOptional()
  readonly lastName: string;
}
