import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaConnectionModule } from '../prisma-connection/prisma-connection.module';

@Module({
  imports: [PrismaConnectionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
