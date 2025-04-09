import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthInputDTO, AuthOutputDTO } from '../dto';
import { AuthService } from '../service/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create new user with the required details', tags: ['Auth'] })
  @ApiOkResponse({ description: 'create User successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiBody({ type: AuthInputDTO })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  signup(@Body() createInput: AuthInputDTO): Promise<AuthOutputDTO> {
    return this.authService.signUp(createInput);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Login existing user with the required details', tags: ['Auth'] })
  @ApiOkResponse({ description: 'User login successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input or credentials are taken' })
  @ApiBody({ type: AuthInputDTO })
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  signin(@Body() input: AuthInputDTO): Promise<AuthOutputDTO> {
    return this.authService.signIn(input);
  }
}
