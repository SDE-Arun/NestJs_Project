import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AppLoggerModule } from './logger/logger.module';
import { PrismaConnectionModule } from './prisma-connection/prisma-connection.module';
import { UserModule } from './user/user.module';

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
