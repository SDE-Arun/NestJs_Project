import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class AuthInputDTO {
  @ApiProperty({
    description: 'email of the user',
    type: String,
  })
  @MinLength(10)
  @MaxLength(30)
  readonly email: string;

  @ApiProperty({
    description: 'password given by user',
    type: String,
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
