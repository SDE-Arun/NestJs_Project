import { Global, Module } from '@nestjs/common';

import { PrismaConnectionService } from './prisma-connection.service';

//* we are making this module global, because we don't want to import that again and again in each module where we want to use it
@Global()
@Module({
  providers: [PrismaConnectionService],
  exports: [PrismaConnectionService],
})
export class PrismaConnectionModule {}

//! Below part is used when we have error this
//? ==>> some worker can't close properly and force exited and exit gracefully. This is likely caused by tests leaking due to improper teardown.
//! and the above thing can be happen anywhere
// export class PrismaConnectionModule implements OnApplicationShutdown {
//   constructor(
//     @Inject('')
//     private readonly prismaClient: PrismaClient
//   ) {}

//   onApplicationShutdown() {
//     this.prismaClient.$disconnect();
//   }
// }
