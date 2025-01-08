import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaConnectionModule } from './prisma-connection/prisma-connection.module';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaConnectionModule,
    AppLoggerModule,
  ],
})
export class AppModule {}
