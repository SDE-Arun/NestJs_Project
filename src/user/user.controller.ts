import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { GetToken } from '../auth/decorator';
import { JWTGuard } from '../auth/guards';
import { UserOutput } from '../interfaces';
import { UserService } from './user.service';
// import { User } from '@prisma/client';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(JWTGuard) //* we set this in jwt strategy file
  // @Get('me')
  // forInfo(
  //   @GetUser('user') user: UserOutput,
  //   @GetUser('email') email: string,
  //   @GetUser('firstName') firstName: string,
  //   @GetUser('lastName') lastName: string
  // ) {
  //   return user;
  // }

  @HttpCode(200)
  @Get('')
  justSayHello() {
    return 'Hello Guys';
  }

  @UseGuards(JWTGuard) //* we set this in jwt strategy file
  @Get('info')
  async getProfile(@GetToken() token: string): Promise<UserOutput> {
    const result = this.userService.getInfoFromToken(token);
    return result;
  }
}
