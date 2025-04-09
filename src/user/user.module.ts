import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppLoggerModule } from '../logger/logger.module';
import { PrismaConnectionModule } from '../prisma-connection/prisma-connection.module';

import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [PrismaConnectionModule, JwtModule.register({}), AppLoggerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
