import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetToken } from '../../auth/decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { UserOutput } from '../../interfaces';
import { UserService } from '../service/user.service';
// import { User } from '@prisma/client';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';

@ApiTags('UserInfo')
@ApiBearerAuth()
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

  @Get('info')
  @ApiOperation({ summary: 'fetch the user profile', tags: ['User Info'] })
  @ApiOkResponse({ description: 'get User successfully' })
  @ApiBadRequestResponse({ description: 'wrong credentials' })
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetToken() token: string): Promise<UserOutput> {
    return this.userService.getInfoFromToken(token);
  }

  @Get('')
  @ApiOperation({ summary: 'Just for checking that everything works fine', tags: ['Server Health'] })
  @ApiOkResponse({ description: 'Everything is working fine' })
  @ApiBadRequestResponse({ description: 'something is wrong, figure it out' })
  @HttpCode(200)
  justSayHello() {
    return 'Hello Guys';
  }
}
