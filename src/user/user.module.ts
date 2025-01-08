import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { PrismaConnectionModule } from '../prisma-connection/prisma-connection.module';

@Module({
  imports: [PrismaConnectionModule, JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
