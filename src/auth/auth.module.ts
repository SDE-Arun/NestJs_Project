import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PrismaConnectionModule } from '../prisma-connection/prisma-connection.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategy';

@Module({
  imports: [PrismaConnectionModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
