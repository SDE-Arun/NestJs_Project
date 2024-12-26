import { Global, Module } from '@nestjs/common';
import { PrismaConnectionService } from './prisma-connection.service';

//* we are making this module global, because we don't want to import that again and again in each module where we want to use it
@Global()
@Module({
  providers: [PrismaConnectionService],
  exports: [PrismaConnectionService],
})
export class PrismaConnectionModule {}
