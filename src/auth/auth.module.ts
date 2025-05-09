import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppLoggerModule } from '../logger/logger.module';
import { PrismaConnectionModule } from '../prisma-connection/prisma-connection.module';
import { JwtStrategy } from '../strategy';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [PrismaConnectionModule, JwtModule.register({}), AppLoggerModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
