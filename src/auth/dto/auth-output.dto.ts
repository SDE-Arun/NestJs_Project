import { ApiProperty } from '@nestjs/swagger';

export class AuthOutputDTO {
  @ApiProperty({ example: 'string', description: 'The access token after signUp/signIn' })
  readonly access_token: string;
}
