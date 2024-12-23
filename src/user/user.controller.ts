import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('user')
export class UserController {
  //   constructor() {}

  @UseGuards(AuthGuard('jwt')) //* we set this in jwt strategy file
  @Get('/me')
  forInfo(@Req() req: Request) {
    return req.user;
  }
}
