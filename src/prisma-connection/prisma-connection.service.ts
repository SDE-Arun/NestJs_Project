import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaConnectionService extends PrismaClient {
  constructor() {
    //   constructor(private readonly configService: ConfigService) {
    // const databaseUrl = this.configService.getOrThrow('DATABASE_URL');
    super({
      datasources: {
        db: {
          // we need to use secrets using configModule
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
}
