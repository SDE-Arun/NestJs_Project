import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() createInput: AuthDTO) {
    return this.authService.signUp(createInput);
  }

  @Post('/signin')
  signin(@Body() input: AuthDTO) {
    return this.authService.signIn(input);
  }
}
