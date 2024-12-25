import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JWTGuard } from '../auth/guards';
import { User } from '@prisma/client';

@UseGuards(JWTGuard) //* we set this in jwt strategy file
@Controller('user')
export class UserController {
  @Get('me')
  forInfo(@GetUser() user: User, @GetUser('email') email: string) {
    console.log('email --> ', email);
    return user;
  }
}
